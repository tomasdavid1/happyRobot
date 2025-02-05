"use client";

import { useSummarizationModal } from "../providers/Summarization-provider"
import { UploadFileModal } from "@components/uploadFileModal";
import { useState } from "react";
import Footer from "@components/Footer";


export default function Home() {
  const { summarizeText,setSummarizationState, summarizationState, summarizeDocument, summary, setIsLoading, isLoading } = useSummarizationModal();
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSummarizeText = async () => {
    setIsLoading(true);
    try {
      if(summarizationState.text){
        const summary = await summarizeText(summarizationState.text); // ✅ Ensure this returns a string
       
      }
    } catch (error) {
  
    }
    setIsLoading(false);
  };
  

  return (
    <div className="flex p-10 flex-col min-h-screen">
      <main className="flex-grow items-center justify-center p-4 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">AI-Powered Document Summarizer</h1>

        {/* Text Input for Manual Entry */}
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md"
          rows={6}
          placeholder="Paste your text here..."
          value={summarizationState.text || ""}
          onChange={(e) =>
            setSummarizationState((prev) => ({ ...prev, text: e.target.value }))
          }

        />

        {/* Summary Length Dropdown */}
        <div className="my-3">
          <label className="font-semibold">Summary Length:</label>
          <select
            className="ml-2 p-2 border border-gray-300 rounded-md"
            onChange={(e) =>
              setSummarizationState((prev) => ({
                ...prev,
                summaryLength: e.target.value as "short" | "medium" | "long", 
              }))
            }
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>

        <UploadFileModal isOpen={isModalOpen} setOpen={setModalOpen}/>
        <button
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
            onClick={() => setModalOpen(true)}
          >
            Upload PDF
          </button>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-3"
          onClick={handleSummarizeText}
          disabled={isLoading}
        >
          {isLoading ? "Summarizing..." : "Summarize"}
        </button>

        {summary && (
          <div className="mt-6 p-4 border border-gray-300 bg-white rounded-md">
            <h2 className="font-semibold mb-2">Summary:</h2>
            <p>{summary}</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
