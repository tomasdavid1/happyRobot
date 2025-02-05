"use client";

import Dropzone, { DropEvent, DropzoneRootProps, DropzoneInputProps, FileRejection } from "react-dropzone";
import { Modal } from "../ui/Modal";
import { useSummarizationModal } from "../providers/Summarization-provider";

interface UploadFileModalProps {
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

export function UploadFileModal({ isOpen, setOpen }: UploadFileModalProps) {
  const { setSummarizationState, summarizeDocument } = useSummarizationModal();

  const handleDrop = (acceptedFiles: File[], fileRejections: FileRejection[], _event: DropEvent) => {
    if (acceptedFiles.length > 0) {
      console.log("acceptedFiles", acceptedFiles[0]);
      setSummarizationState((prev) => ({ ...prev, file: acceptedFiles[0] }));
      summarizeDocument();
      setOpen(false); // ✅ Close modal after successful upload
    } else {
      console.error("No valid files uploaded.");
    }
  };

  return (
    <Modal
      title="Upload a PDF"
      desc="Drag & drop a PDF file below or click to select one."
      isOpen={isOpen}
      setOpen={setOpen}
      size="normal"
    >
      <Dropzone onDrop={handleDrop} accept={{ "application/pdf": [".pdf"] }}>
        {({
          getRootProps,
          getInputProps,
        }: {
          getRootProps: () => DropzoneRootProps;
          getInputProps: () => DropzoneInputProps;
        }) => {
          const rootProps = getRootProps();
          const inputProps = getInputProps();

          return (
            <div
              {...rootProps}
              className="border-dashed border-2 border-gray-400 p-6 text-center cursor-pointer"
            >
              <input {...(inputProps as any)} />
              <p>Drag & drop a PDF here, or click to select one.</p>
            </div>
          );
        }}
      </Dropzone>
    </Modal>
  );
}
