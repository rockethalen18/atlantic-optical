import os
import json
import re
import fitz  # PyMuPDF

def clean_filename(name):
    # Remove characters that are invalid in Windows filenames
    cleaned = re.sub(r'[\\/*?:"<>|]', '', name)
    # Replace multiple spaces with a single space and trim
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned

def get_short_name(name, max_len=40):
    cleaned = clean_filename(name)
    if len(cleaned) > max_len:
        truncated = cleaned[:max_len].rsplit(' ', 1)[0]
        if not truncated:
            truncated = cleaned[:max_len]
        return truncated
    return cleaned

def extract_reference_from_text(text, products):
    lines = text.split('\n')
    for line in lines:
        line_upper = line.upper()
        if "REFERENCIA:" in line_upper or "REF:" in line_upper:
            parts = re.split(r'REFERENCIA:|REF:', line, flags=re.IGNORECASE)
            if len(parts) > 1:
                ref_part = parts[1].strip()
                ref_words = ref_part.split()
                if ref_words:
                    candidate = ref_words[0].strip()
                    candidate_clean = re.sub(r'[,;.:]$', '', candidate)
                    if candidate_clean:
                        return candidate_clean

    # Fallback: search for any known product reference in the text
    sorted_products = sorted(products, key=lambda x: len(x.get('reference', '')), reverse=True)
    for p in sorted_products:
        ref = p.get('reference', '')
        if ref and len(ref) >= 3:
            ref_escaped = re.escape(ref)
            if re.search(r'\b' + ref_escaped + r'\b', text, re.IGNORECASE):
                return ref

    return None

def main():
    catalogos_dir = r"c:\Users\sebas\OneDrive\Desktop\webs\Atlantic Optical\atlantic-optical\catalogos"
    products_json_path = os.path.join(catalogos_dir, "products.json")
    output_dir = os.path.join(catalogos_dir, "extracted_images")

    if not os.path.exists(products_json_path):
        print(f"Error: products.json not found at {products_json_path}")
        return

    with open(products_json_path, 'r', encoding='utf-8') as f:
        products = json.load(f)

    print(f"Loaded {len(products)} products from products.json")

    # Group products by their reference for easy lookup
    product_map = {}
    for p in products:
        ref = p.get('reference', '')
        if ref:
            ref_norm = ref.strip().upper()
            if ref_norm not in product_map:
                product_map[ref_norm] = []
            product_map[ref_norm].append(p)

    pdf_files = [
        "EQUIPOS DE OFTALMOLOGIA Y OPTICA.pdf",
        "EQUIPOS DE LABORATORIO.pdf",
        "MOBILIARIO.pdf",
        "MONITORES Y OPTOTIPOS.pdf"
    ]

    os.makedirs(output_dir, exist_ok=True)

    summary = {
        "processed_pages": 0,
        "matched_pages": 0,
        "unmatched_pages": 0,
        "images_extracted": 0,
        "pdf_reports": []
    }

    for pdf_name in pdf_files:
        pdf_path = os.path.join(catalogos_dir, pdf_name)
        if not os.path.exists(pdf_path):
            print(f"Warning: PDF file not found: {pdf_path}")
            continue

        print(f"\nProcessing PDF: {pdf_name}...")
        doc = fitz.open(pdf_path)
        pdf_report = {
            "name": pdf_name,
            "total_pages": len(doc),
            "matches": []
        }

        for page_num in range(len(doc)):
            summary["processed_pages"] += 1
            page = doc[page_num]
            text = page.get_text()

            ref_found = extract_reference_from_text(text, products)

            matched_products = []
            if ref_found:
                ref_norm = ref_found.strip().upper()
                if ref_norm in product_map:
                    matched_products = product_map[ref_norm]
                else:
                    for r_key, p_list in product_map.items():
                        if ref_norm in r_key or r_key in ref_norm:
                            matched_products = p_list
                            break

            if matched_products:
                summary["matched_pages"] += 1
                prod = matched_products[0]
                prod_name = prod.get("name", "Product")
                prod_ref = prod.get("reference", "")
                
                short_prod_name = get_short_name(prod_name, max_len=40)
                folder_name = clean_filename(f"{prod_ref} - {short_prod_name}")
                prod_folder = os.path.join(output_dir, folder_name)
                os.makedirs(prod_folder, exist_ok=True)

                image_list = page.get_images(full=True)
                extracted_on_page = 0

                for img_idx, img in enumerate(image_list):
                    xref = img[0]
                    base_image = doc.extract_image(xref)
                    image_bytes = base_image["image"]
                    image_ext = base_image["ext"]

                    # Filter out very small/decorative images
                    if len(image_bytes) < 4096:
                        continue

                    extracted_on_page += 1
                    summary["images_extracted"] += 1

                    img_name = f"{clean_filename(prod_ref)}_{clean_filename(short_prod_name)}_{extracted_on_page}.{image_ext}"
                    img_path = os.path.join(prod_folder, img_name)

                    with open(img_path, "wb") as f_img:
                        f_img.write(image_bytes)

                pdf_report["matches"].append({
                    "page": page_num + 1,
                    "reference_found": ref_found,
                    "product_name": prod_name,
                    "images_extracted": extracted_on_page
                })
                print(f"  Page {page_num + 1}: Matched to reference '{ref_found}' -> Extracted {extracted_on_page} images")
            else:
                summary["unmatched_pages"] += 1
                pdf_report["matches"].append({
                    "page": page_num + 1,
                    "reference_found": None,
                    "product_name": None,
                    "images_extracted": 0
                })
                # print(f"  Page {page_num + 1}: No matching product found")

        summary["pdf_reports"].append(pdf_report)

    print("\n" + "="*40)
    print("EXTRACTION SUMMARY")
    print("="*40)
    print(f"Total Pages Processed: {summary['processed_pages']}")
    print(f"Successfully Matched Pages: {summary['matched_pages']}")
    print(f"Unmatched Pages: {summary['unmatched_pages']}")
    print(f"Total Images Extracted: {summary['images_extracted']}")
    print("="*40)

if __name__ == "__main__":
    main()
