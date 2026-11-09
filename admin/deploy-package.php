<?php
/**
 * Deploy a packaged build over HTTPS.
 *
 * The shared host rejects FTP logins from the GitHub Actions runner pool
 * (530 Login authentication failed), so the build is uploaded as a single
 * ZIP over HTTPS instead of 1700 small FTP transfers.
 *
 * How it works
 * ------------
 * The CI job packages the build as:
 *
 *     site/...            the static export (the site root)
 *     site/admin/...      the admin panel
 *     site/backend/...    the API
 *     site/catalogos/...  the product catalog
 *
 * The archive is unpacked into a temporary folder inside the site and the
 * contents are then moved over the live site. Folders are swapped with a
 * rename, so the public site keeps working while the deploy runs.
 *
 * Security
 * --------
 * - POST only, and protected by DEPLOY_KEY (stored next to the site, never
 *   in the repository).
 * - Archive entries may never escape the site root.
 * - The secrets file is never overwritten by a deploy.
 */
declare(strict_types=1);

require_once __DIR__ . '/includes/secrets.php';

header('Content-Type: application/json; charset=utf-8');

@set_time_limit(0);
@ini_set('memory_limit', '512M');

/** Remove a folder and everything inside it. */
function ao_rmtree(string $dir): void {
    if (!is_dir($dir)) {
        @unlink($dir);
        return;
    }
    $items = scandir($dir);
    if ($items === false) return;
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $path = $dir . '/' . $item;
        if (is_dir($path) && !is_link($path)) {
            ao_rmtree($path);
        } else {
            @unlink($path);
        }
    }
    @rmdir($dir);
}

/** Copy a folder recursively (fallback when a rename is not possible). */
function ao_copytree(string $from, string $to): void {
    if (!is_dir($to)) @mkdir($to, 0755, true);
    $items = scandir($from);
    if ($items === false) return;
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $src = $from . '/' . $item;
        $dst = $to . '/' . $item;
        if (is_dir($src)) {
            ao_copytree($src, $dst);
        } else {
            @copy($src, $dst);
        }
    }
}

/**
 * Copy the contents of a folder over another one, keeping the files that are
 * not part of the package. This is what protects the photos the owner
 * uploads from the admin panel: they live in admin/uploads/ and are not in
 * the repository, so they must survive every deploy.
 */
function ao_merge_tree(string $from, string $to): void {
    if (!is_dir($to)) @mkdir($to, 0755, true);
    $items = scandir($from);
    if ($items === false) return;
    foreach ($items as $item) {
        if ($item === '.' || $item === '..') continue;
        $src = $from . '/' . $item;
        $dst = $to . '/' . $item;
        if (is_dir($src)) {
            ao_merge_tree($src, $dst);
        } else {
            @copy($src, $dst);
        }
    }
}

// ------------------------------------------------------------------ auth ---
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'POST required']);
    exit;
}

$expected = ao_secret('DEPLOY_KEY');
if ($expected === '') {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Deploy key is not configured']);
    exit;
}

$provided = $_SERVER['HTTP_X_DEPLOY_KEY'] ?? ($_POST['key'] ?? '');
if (!hash_equals($expected, (string)$provided)) {
    http_response_code(403);
    echo json_encode(['ok' => false, 'error' => 'Invalid key']);
    exit;
}

// --------------------------------------------------------------- package ---
if (!isset($_FILES['package']) || !is_uploaded_file($_FILES['package']['tmp_name'])) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'No package uploaded']);
    exit;
}

$archive = $_FILES['package']['tmp_name'];
$archiveSize = (int)($_FILES['package']['size'] ?? 0);
if ($archiveSize <= 0) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'The package is empty']);
    exit;
}

$root = dirname(__DIR__);
$tmpDir = $root . '/.deploy-tmp-' . bin2hex(random_bytes(6));

$zip = new ZipArchive();
if ($zip->open($archive) !== true) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'The package is not a valid ZIP archive']);
    exit;
}

// Validate every entry before a single file is written.
$entries = 0;
for ($i = 0; $i < $zip->numFiles; $i++) {
    $name = (string)$zip->getNameIndex($i);
    if ($name === '') continue;
    if (str_contains($name, "\0") || str_contains($name, '..')) {
        $zip->close();
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'The package contains an invalid path']);
        exit;
    }
    if (str_starts_with($name, '/') || preg_match('#^[A-Za-z]:#', $name)) {
        $zip->close();
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'The package contains an absolute path']);
        exit;
    }
    // The secrets file must never be replaced by a deploy.
    if (basename($name) === '.atlantic-secrets.php') {
        $zip->close();
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'The package contains a reserved file']);
        exit;
    }
    if (!str_ends_with($name, '/')) $entries++;
}

if (!@mkdir($tmpDir, 0755, true)) {
    $zip->close();
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not create the temporary folder']);
    exit;
}

if (!$zip->extractTo($tmpDir)) {
    $zip->close();
    ao_rmtree($tmpDir);
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Could not unpack the package']);
    exit;
}
$zip->close();

$source = $tmpDir . '/site';
if (!is_dir($source)) {
    ao_rmtree($tmpDir);
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'The package has no "site" folder']);
    exit;
}

// ---------------------------------------------------------------- deploy ---
// Folders that are replaced completely (build output with hashed file names,
// so leftovers would pile up). Everything else is merged, so files that are
// not part of the package - such as the photos uploaded from the admin
// panel - are kept.
$replaceWholesale = ['_next'];

$replaced = [];
$failed = [];
$items = scandir($source);
foreach ($items ?: [] as $item) {
    if ($item === '.' || $item === '..') continue;
    $from = $source . '/' . $item;
    $to = $root . '/' . $item;

    if (is_dir($from)) {
        if (in_array($item, $replaceWholesale, true)) {
            $backup = $to . '.previous-' . bin2hex(random_bytes(3));
            $moved = false;
            if (is_dir($to) || is_link($to)) {
                if (@rename($to, $backup)) $moved = true;
            }
            if (@rename($from, $to)) {
                if ($moved) ao_rmtree($backup);
            } else {
                ao_copytree($from, $to);
                if ($moved) ao_rmtree($backup);
            }
            $replaced[] = $item . '/ (replaced)';
        } else {
            ao_merge_tree($from, $to);
            $replaced[] = $item . '/ (merged)';
        }
    } else {
        if (@copy($from, $to)) {
            $replaced[] = $item;
        } else {
            $failed[] = $item;
        }
    }
}

ao_rmtree($tmpDir);

echo json_encode([
    'ok' => empty($failed),
    'files_in_package' => $entries,
    'replaced' => $replaced,
    'failed' => $failed,
    'deployed_at' => gmdate('c'),
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
