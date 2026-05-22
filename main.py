from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import io
from pdf_engine import process_full_pdf

app = FastAPI()

# CORS पॉलिसी चालू ताकि फ्रंटएंड आसानी से कनेक्ट हो सके
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Backend is running flawlessly!"}

@app.post("/api/v1/translate")
async def translate_pdf(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF supported.")
    try:
        pdf_content = await file.read()
        translated_pdf_bytes = await process_full_pdf(pdf_content)
        return StreamingResponse(
            io.BytesIO(translated_pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=translated.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
