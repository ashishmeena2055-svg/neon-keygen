"use client";
import React, { useState } from "react";

interface UploadZoneProps {
  onUploadSuccess: (originalUrl: string, translatedUrl: string) => void;
}

export default function UploadZone({ onUploadSuccess }: UploadZoneProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") {
      setError("कृपया केवल PDF फाइल ही अपलोड करें।");
      return;
    }

    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const originalUrl = URL.createObjectURL(file);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backendUrl}/api/v1/translate`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("अनुवाद में त्रुटि आई।");
      const blob = await response.blob();
      const translatedUrl = URL.createObjectURL(blob);
      onUploadSuccess(originalUrl, translatedUrl);
    } catch (err: any) {
      setError(err.message || "कुछ गड़बड़ हुई।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', border: '2px dashed #334155', borderRadius: '0.75rem', backgroundColor: 'rgba(15,23,42,0.5)', maxWidth: '36rem', margin: '5rem auto 0 auto'}}>
      <h2 style={{fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: '#ffffff'}}>NEET AI PDF Translator</h2>
      <p style={{color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center', marginBottom: '1.5rem'}}>अपनी NEET इंग्लिश बुक या पेपर अपलोड करें।</p>
      {loading ? (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <p style={{color: '#818cf8', fontWeight: '500'}}>AI पैरेलल ट्रांसलेशन चालू है...</p>
        </div>
      ) : (
        <label style={{cursor: 'pointer', backgroundColor: '#4f46e5', color: '#ffffff', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontWeight: '600'}}>
          फाइल चुनें (Choose PDF)
          <input type="file" accept=".pdf" style={{display: 'none'}} onChange={handleFileChange} />
        </label>
      )}
      {error && <p style={{color: '#f87171', marginTop: '1rem', fontSize: '0.875rem', fontWeight: '500'}}>{error}</p>}
    </div>
  );
}
