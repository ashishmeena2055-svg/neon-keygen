import fitz  # PyMuPDF
import asyncio
from translator import translate_text_block

async def process_single_page(page_bytes: bytes, page_num: int) -> bytes:
    doc = fitz.open(stream=page_bytes, filetype="pdf")
    page = doc[0]
    
    text_instances = page.get_text("blocks")
    translation_tasks = []
    blocks_to_replace = []

    for block in text_instances:
        x0, y0, x1, y1, text, block_no, block_type = block
        if block_type == 0 and text.strip():
            blocks_to_replace.append(block)
            translation_tasks.append(translate_text_block(text))

    translated_texts = await asyncio.gather(*translation_tasks)

    for block in blocks_to_replace:
        x0, y0, x1, y1, _, _, _ = block
        page.add_redact_annot(fitz.Rect(x0, y0, x1, y1), fill=False) 
    
    page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)

    for i, block in enumerate(blocks_to_replace):
        x0, y0, x1, y1, _, _, _ = block
        hindi_text = translated_texts[i]
        
        available_width = x1 - x0
        font_size = 11
        
        while font_size > 6:
            text_length = fitz.get_text_length(hindi_text, fontname="helv", fontsize=font_size)
            if text_length <= available_width:
                break
            font_size -= 0.5

        page.insert_text(
            fitz.Point(x0, y0 + font_size), 
            hindi_text, 
            fontsize=font_size, 
            fontname="helv",
            color=(0, 0, 0)
        )

    return doc.write()

async def process_full_pdf(file_bytes: bytes) -> bytes:
    src_doc = fitz.open(stream=file_bytes, filetype="pdf")
    total_pages = len(src_doc)
    
    tasks = []
    for page_num in range(total_pages):
        single_page_doc = fitz.open()
        single_page_doc.insert_pdf(src_doc, from_page=page_num, to_page=page_num)
        page_bytes = single_page_doc.write()
        single_page_doc.close()
        tasks.append(process_single_page(page_bytes, page_num))
    
    processed_pages_bytes = await asyncio.gather(*tasks)
    
    output_doc = fitz.open()
    for p_bytes in processed_pages_bytes:
        page_doc = fitz.open(stream=p_bytes, filetype="pdf")
        output_doc.insert_pdf(page_doc)
        page_doc.close()
        
    final_pdf_bytes = output_doc.write()
    output_doc.close()
    src_doc.close()
    return final_pdf_bytes
