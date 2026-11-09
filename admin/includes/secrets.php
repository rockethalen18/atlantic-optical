<?php
/**
 * Secret configuration loader.
 *
 * The credentials must never be committed to the repository - it is public.
 * They are read instead from a small PHP file that sits next to the site
 * (and therefore outside the public folder), or from environment variables.
 *
 * The secrets file is a plain PHP file that returns an array:
 *
 *     <?php return [
 *         'DB_HOST'          => 'localhost',
 *         'DB_NAME'          => '...',
 *         'DB_USER'          => '...',
 *         'DB_PASS'          => '...',
 *         'IMAGE_SYNC_SECRET'=> '...',
 *     ];
 *
 * Because it is PHP, requesting it over HTTP executes it and prints nothing,
 * so it can never be read as plain text.
 */
if (!function_exists('ao_secrets')) {
    /**
     * Load the secrets (cached for the request).
     */
    function ao_secrets(): array {
        static $secrets = null;
        if ($secrets !== null) return $secrets;

        $secrets = [];
        $candidates = [];

        $fromEnv = getenv('ATLANTIC_SECRETS_FILE');
        if ($fromEnv) $candidates[] = $fromEnv;

        $docRoot = rtrim($_SERVER['DOCUMENT_ROOT'] ?? '', '/');
        if ($docRoot !== '') {
            $candidates[] = $docRoot . '/.atlantic-secrets.php';
            $candidates[] = dirname($docRoot) . '/.atlantic-secrets.php';
        }

        // admin/includes/... and backend/config/... both live two levels below
        // the site root and three levels below the account home.
        $candidates[] = dirname(__DIR__, 2) . '/.atlantic-secrets.php';
        $candidates[] = dirname(__DIR__, 3) . '/.atlantic-secrets.php';

        foreach ($candidates as $file) {
            if (!is_file($file) || !is_readable($file)) continue;
            $loaded = @include $file;
            if (is_array($loaded)) {
                $secrets = $loaded;
                break;
            }
        }

        // Environment variables always win (handy for local development).
        foreach (['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS', 'IMAGE_SYNC_SECRET'] as $key) {
            $value = getenv($key);
            if ($value !== false && $value !== '') $secrets[$key] = $value;
        }

        return $secrets;
    }

    /**
     * Read a single secret.
     */
    function ao_secret(string $key, string $default = ''): string {
        $secrets = ao_secrets();
        if (!isset($secrets[$key]) || $secrets[$key] === '') return $default;
        return (string)$secrets[$key];
    }
}
