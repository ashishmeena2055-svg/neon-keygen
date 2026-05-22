"use client";
import React, { useState } from "react";

interface PDFWorkspaceProps {
  originalUrl: string;
  translatedUrl: string;
}

export default function PDFWorkspace({ originalUrl, translatedUrl }: PDFWorkspaceProps) {
  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white">
      <div className="h-14 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6">
        <h1 className="font-bold text-indigo-400">NEET Real-Time Interactive Editor Workspace</h1>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 border-r border-slate-800 flex flex-col">
          <div className="bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">Original English PDF</div>
          <iframe src={originalUrl} className="w-full h-full border-none" />
        </div>
        <div className="w-1/2 flex flex-col">
          <div className="bg-slate-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-indigo-400">Translated Hindi PDF</div>
          <iframe src={translatedUrl} className="w-full h-full border-none bg-white" />
        </div>
      </div>
    </div>
  );
}
