import os
import hashlib
from collections import defaultdict

def get_md5(file_path):
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()

def main():
    extracted_dir = r"c:\Users\sebas\OneDrive\Desktop\webs\Atlantic Optical\atlantic-optical\catalogos\extracted_images"
    if not os.path.exists(extracted_dir):
        print("Directory does not exist.")
        return

    # Phase 1: Group files by MD5 hash
    hash_to_files = defaultdict(list)
    for root, dirs, files in os.walk(extracted_dir):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff')):
                file_path = os.path.join(root, file)
                try:
                    file_hash = get_md5(file_path)
                    hash_to_files[file_hash].append(file_path)
                except Exception as e:
                    print(f"Error reading {file_path}: {e}")

    # Phase 2: Identify border/template hashes (appearing in 2 or more different folders)
    border_hashes = []
    border_files_count = 0
    
    for file_hash, paths in hash_to_files.items():
        # Get unique folder names for these paths
        folders = {os.path.dirname(p) for p in paths}
        if len(folders) >= 2:
            border_hashes.append((file_hash, len(paths)))
            border_files_count += len(paths)

    print(f"Found {len(border_hashes)} background/border templates (totaling {border_files_count} files) to delete.")

    # Phase 3: Delete the border/template files
    deleted_count = 0
    for file_hash, _ in border_hashes:
        for path in hash_to_files[file_hash]:
            try:
                os.remove(path)
                deleted_count += 1
            except Exception as e:
                print(f"Error deleting {path}: {e}")

    print(f"Deleted {deleted_count} border/template files successfully.")

    # Phase 4: Rename remaining files sequentially in each directory
    renamed_count = 0
    empty_folders = []

    # Iterate over each subdirectory
    for subdir in os.listdir(extracted_dir):
        subdir_path = os.path.join(extracted_dir, subdir)
        if not os.path.isdir(subdir_path):
            continue

        # Get list of remaining image files in this folder
        remaining_files = [f for f in os.listdir(subdir_path) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
        
        if not remaining_files:
            empty_folders.append(subdir)
            continue

        # Sort remaining files naturally/alphabetically so order is preserved
        remaining_files.sort()

        # Temporary rename to avoid naming collisions
        temp_renamed = []
        for idx, file in enumerate(remaining_files):
            old_path = os.path.join(subdir_path, file)
            # Create a unique temp name
            ext = os.path.splitext(file)[1]
            temp_name = f"temp_image_{idx}_{ext}"
            temp_path = os.path.join(subdir_path, temp_name)
            os.rename(old_path, temp_path)
            temp_renamed.append((temp_path, idx + 1, ext))

        # Final rename to sequential format: {Folder_Name}_{Index}.ext
        # To be clean, we can name the image exactly like the folder name:
        # {Folder_Name}_{Index}.ext
        for temp_path, seq_index, ext in temp_renamed:
            new_name = f"{subdir}_{seq_index}{ext}"
            new_path = os.path.join(subdir_path, new_name)
            os.rename(temp_path, new_path)
            renamed_count += 1

    print(f"Renamed {renamed_count} remaining images to be sequential.")
    if empty_folders:
        print(f"\nWarning: {len(empty_folders)} folders are now empty (contained only borders/frames):")
        for folder in empty_folders:
            print(f"  - {folder}")

if __name__ == "__main__":
    main()
