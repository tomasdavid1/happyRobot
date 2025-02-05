"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { summarizePDF, summarizeText } from "../utils/summarize";

interface SummarizationState {
  id: string;
  file: File | null;
  text: string | null;
  summary: string | null;
  summaryLength: "short" | "medium" | "long";
}

const defaultState: SummarizationState = {
  id: "",
  file: null,
  text: "",
  summary: null,
  summaryLength: "medium",
};

interface SummarizationModalContextProps {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  summarizationState: SummarizationState;
  setSummarizationState: React.Dispatch<React.SetStateAction<SummarizationState>>;
  summarizeText: (text: string) => Promise<void>;
  summarizeDocument: () => Promise<void>;
  setIsLoading : React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  summary: string | null;
}

const SummarizationModalContext = createContext<SummarizationModalContextProps | undefined>(undefined);

export const SummarizationModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [summarizationState, setSummarizationState] = useState<SummarizationState>(defaultState);
  const [isLoading, setIsLoading] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setSummarizationState(defaultState);
  };

  /** ✅ Handle Text Summarization */
  const handleSummarizeText = async (text: string) => {
    setIsLoading(true);
    try {
      const summary = await summarizeText(text, summarizationState.summaryLength) ; // ✅ Call the util directly
      console.log('final summary is :', summary)
      setSummarizationState((prev) => ({
        ...prev,
        summary: summary || "No summary available", // ✅ Ensure it's a valid string
      }));
    } catch (error) {
      console.error("Error summarizing text:", error);
    }
    setIsLoading(false);
  };

  /** ✅ Handle File Summarization */
  const handleSummarizeDocument = async () => {
    if (!summarizationState.file && !summarizationState.text) {
      console.error("No input provided for summarization");
      return;
    }

    setIsLoading(true);

    try {
      let summary: string | null = null;

      if (summarizationState.file) {
        summary = await summarizePDF(summarizationState.file, summarizationState.summaryLength);
      } else {
        if(summarizationState.text){
          summary = await summarizeText(summarizationState.text, summarizationState.summaryLength);
        }
      }

      setSummarizationState((prev) => ({ ...prev, summary }));
    } catch (error) {
      console.error("Error summarizing document:", error);
    }

    setIsLoading(false);
    closeModal();
  };

  return (
    <SummarizationModalContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        summarizationState,
        setSummarizationState,
        summarizeText: handleSummarizeText, // ✅ Updated
        summarizeDocument: handleSummarizeDocument, // ✅ Updated
        isLoading,
        setIsLoading,
        summary: summarizationState.summary,
      }}
    >
      {children}
    </SummarizationModalContext.Provider>
  );
};

export const useSummarizationModal = (): SummarizationModalContextProps => {
  const context = useContext(SummarizationModalContext);
  if (!context) {
    throw new Error("useSummarizationModal must be used within a SummarizationModalProvider");
  }
  return context;
};
