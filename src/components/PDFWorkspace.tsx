"use client";
import React from "react";

interface PDFWorkspaceProps {
  originalUrl: string;
  translatedUrl: string;
}

export default function PDFWorkspace({ originalUrl, translatedUrl }: PDFWorkspaceProps) {
  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#020617', color: '#ffffff'}}>
      <div style={{height: '3.5rem', borderBottom: '1px solid #1e293b', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'between', padding: '0 1.5rem'}}>
        <h1 style={{fontWeight: 'bold', color: '#818cf8'}}>NEET Real-Time Interactive Editor Workspace</h1>
      </div>
      <div style={{display: 'flex', flex: 1, overflow: 'hidden'}}>
        <div style={{width: '50%', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column'}}>
          <div style={{backgroundColor: '#0f172a', padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8'}}>Original English PDF</div>
          <iframe src={originalUrl} style={{width: '100%', height: '100%', border: 'none'}} />
        </div>
        <div style={{width: '50%', display: 'flex', flexDirection: 'column'}}>
          <div style={{backgroundColor: '#0f172a', padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#818cf8'}}>Translated Hindi PDF</div>
          <iframe src={translatedUrl} style={{width: '100%', height: '100%', border: 'none', backgroundColor: '#ffffff'}} />
        </div>
      </div>
    </div>
  );
}
