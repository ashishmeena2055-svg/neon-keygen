import React from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi">
      <body style={{margin: 0, padding: 0, fontFamily: 'sans-serif'}}>{children}</body>
    </html>
  );
}
