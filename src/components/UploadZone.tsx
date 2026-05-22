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
      
      // डिप्लॉयमेंट के समय लोकलहोस्ट की जगह अपना लाइव बैकएंड URL बदलें
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
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-700 rounded-xl bg-slate-900/50 max-w-xl mx-auto mt-20">
      <h2 className="text-xl font-bold mb-4 text-white">NEET AI PDF Translator</h2>
      <p className="text-slate-400 text-sm text-center mb-6">अपनी NEET इंग्लिश बुक या पेपर अपलोड करें।</p>
      {loading ? (
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mb-2"></div>
          <p className="text-indigo-400 font-medium">AI पैरेलल ट्रांसलेशन चालू है...</p>
        </div>
      ) : (
        <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
          फाइल चुनें (Choose PDF)
          <input type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
        </label>
      )}
      {error && <p className="text-red-400 mt-4 text-sm font-medium">{error}</p>}
    </div>
  );
}
