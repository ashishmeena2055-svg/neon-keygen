"use client";
import React, { useState } from "react";
import UploadZone from "../components/UploadZone";
import PDFWorkspace from "../components/PDFWorkspace";

export default function Home() {
  const [pdfData, setPdfData] = useState<{ original: string; translated: string } | null>(null);

  return (
    <main style={{minHeight: '100vh', backgroundColor: '#020617', color: '#f1f5f9'}}>
      {!pdfData ? (
        <div style={{margin: '0 auto', padding: '2.5rem 1rem'}}>
          <header style={{textAlign: 'center', marginBottom: '3rem'}}>
            <h1 style={{fontSize: '2.25rem', fontWeight: '800', color: '#818cf8'}}>
              Professional Real-Time PDF Translator
            </h1>
          </header>
          <UploadZone onUploadSuccess={(original, translated) => setPdfData({ original, translated })} />
        </div>
      ) : (
        <PDFWorkspace originalUrl={pdfData.original} translatedUrl={pdfData.translated} />
      )}
    </main>
  );
}
