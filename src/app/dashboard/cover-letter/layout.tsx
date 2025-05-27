import Script from "next/script";

export default function CoverLetterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js"
        strategy="beforeInteractive"
      />
      <Script
        id="pdf-worker"
        dangerouslySetInnerHTML={{
          __html: `
            window['pdfjs-dist/build/pdf'] = window.pdfjsLib;
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
          `,
        }}
      />
      {children}
    </>
  );
}
