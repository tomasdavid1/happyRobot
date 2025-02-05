import OpenAI from "openai";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js`;
const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY, dangerouslyAllowBrowser: true });

const MAX_TOKENS = 4096; 

export async function summarizeText(text: string, length: "short" | "medium" | "long"): Promise<string> {
  if (!text.trim()) throw new Error("No text provided");

  const chunks = chunkText(text, MAX_TOKENS);
  let summaries: string[] = [];

  for (const chunk of chunks) {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are an AI assistant that generates summaries." },
        { role: "user", content: `Summarize the following text:\n\n${chunk}` },
      ],
      max_tokens: 500,
    });

    summaries.push(aiResponse.choices[0]?.message?.content || "");
  }

  return refineFinalSummary(summaries, length);
}

export async function extractTextFromPDF(file: File): Promise<string> {

  
  const buffer = await file.arrayBuffer(); 
  const pdf = await getDocument({ data: buffer }).promise; 

  let extractedText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    extractedText += textContent.items.map((item: any) => item.str).join(" ") + "\n";
  }

  return extractedText || "No text found in PDF.";
}

/** ✅ Summarize a PDF file */
export async function summarizePDF(file: File, length: "short" | "medium" | "long"): Promise<string> {
  const text = await extractTextFromPDF(file); // ✅ Extract text first
  return summarizeText(text, length);
}
async function refineFinalSummary(summaries: string[], length: "short" | "medium" | "long"): Promise<string> {
  const mergedSummaries = summaries.join("\n\n");

  // ✅ Define length descriptions
  const lengthDescriptions: Record<"short" | "medium" | "long", string> = {
    short: "a brief summary (1-2 sentences).",
    medium: "a detailed summary (1-2 paragraphs).",
    long: "a comprehensive summary with key details.",
  };

  console.log('lenght',lengthDescriptions[length])

  const aiResponse = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      { role: "system", content: "You are an AI assistant that generates summaries." },
      { 
        role: "user", 
        content: `Here are multiple summaries of a long document:\n\n${mergedSummaries}\n\nPlease generate ${lengthDescriptions[length]}.`
      },
    ],
    max_tokens: 800,
  });

  return aiResponse.choices[0]?.message?.content || "";
}

function chunkText(text: string, maxLength: number): string[] {
  const words = text.split(" ");
  const chunks: string[] = [];
  let currentChunk = "";

  for (const word of words) {
    if ((currentChunk + word).length > maxLength) {
      chunks.push(currentChunk);
      currentChunk = word;
    } else {
      currentChunk += " " + word;
    }
  }

  if (currentChunk) chunks.push(currentChunk.trim());

  return chunks;
}