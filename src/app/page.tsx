"use client";
import React, { useState } from "react";
import UploadZone from "@/components/UploadZone";
import PDFWorkspace from "@/components/PDFWorkspace";

export default function Home() {
  const [pdfData, setPdfData] = useState<{ original: string; translated: string } | null>(null);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {!pdfData ? (
        <div className="container mx-auto px-4 py-10">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
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
