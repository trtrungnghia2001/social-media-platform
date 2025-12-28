"use client";
import { CloudUpload, Send, X } from "lucide-react";
import Image from "next/image";
import { memo, useEffect, useMemo, useRef, useState } from "react";

const MessageForm = () => {
  // file
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const filePreview = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);
  useEffect(() => {
    if (filePreview) {
      return () => {
        URL.revokeObjectURL(filePreview);
      };
    }
  }, [filePreview]);
  return (
    <div className="relative border-t border-t-border">
      {/*  */}
      {filePreview && (
        <div className="absolute bottom-full left-0 right-0 border-b border-b-border p-4 backdrop-blur-xl">
          <button
            onClick={() => setFile(null)}
            className="btn-options absolute top-2 right-2"
          >
            <X size={16} />
          </button>
          <Image
            alt="file"
            src={filePreview}
            loading="lazy"
            width={128}
            height={128}
            unoptimized
            className="rounded-lg"
          />
        </div>
      )}
      {/*  */}
      <div className="flex items-center gap-2 p-4">
        <button
          className="btn-options"
          onClick={() => inputFileRef.current?.click()}
        >
          <CloudUpload size={18} />
        </button>
        <input
          placeholder="Typing..."
          type="text"
          className="px-3 py-1.5 rounded-full border border-border flex-1 outline-none transition-all"
        />
        <input
          type="file"
          hidden
          ref={inputFileRef}
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
              setFile(selectedFile);
              e.target.value = "";
            }
          }}
        />
        <button className="btn-options">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default memo(MessageForm);
