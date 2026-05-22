import os
import json
import asyncio
from openai import AsyncOpenAI

# API Key एनवायरनमेंट वेरिएबल से आएगी
client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def translate_text_block(text: str) -> str:
    if not text.strip() or text.isdigit():
        return text

    system_prompt = (
        "You are an expert NEET exam paper and textbook translator. "
        "Translate English textbook text into Hindi tailored perfectly for Hindi-medium NEET aspirants.\n\n"
        "CRITICAL RULES:\n"
        "1. AUTO-DETECT: Scan the text for any Physics, Chemistry, or Biology terms.\n"
        "2. NO COMPLEX HINDI: Do NOT use complex pure Hindi words (e.g., Do NOT write 'अपचयोपचय' for Redox).\n"
        "3. DEVANAGARI TRANSLITERATION: Write technical terms in Devanagari script (e.g., Redox Reaction -> रेडॉक्स अभिक्रिया).\n"
        "4. FORMULAS: Keep formulas (e.g., H2SO4) exactly in English characters.\n"
        "5. OUTPUT: Return ONLY the final translated text."
    )

    try:
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text}
            ],
            temperature=0.15
        )
        return response.choices.message.content.strip()
    except Exception as e:
        print(f"Error: {e}")
        return text
