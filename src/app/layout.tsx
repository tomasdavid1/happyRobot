import type { Metadata } from "next";
import "@styles/globals.css";
import { SummarizationModalProvider } from "../providers/Summarization-provider";

export const metadata: Metadata = {
  title: "AI-Powered Document Summarizer",
  description: "Summarize long documents using AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-100 text-gray-800">
=          <SummarizationModalProvider>  
            {children}
          </SummarizationModalProvider>
      </body>
    </html>
  );
}
