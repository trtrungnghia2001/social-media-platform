"use client";
import { useMutation } from "@tanstack/react-query";
import { Paperclip, Send, X } from "lucide-react";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

const MessageForm = () => {
  // files
  const [file, setFile] = useState<File | null>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const filePreview = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);
  useEffect(() => {
    if (filePreview) {
      return () => {
        URL.revokeObjectURL(filePreview);
      };
    }
  }, [filePreview]);
  const handleFilePreviews = () => {
    setFile(null);
  };

  const [content, setContent] = useState("");
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file && !content) return;
    mutate();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      console.log({ content, file });
    },
  });
  return (
    <div className="relative">
      {/* preview */}
      {filePreview && (
        <div className="flex flex-wrap gap-2 p-4 absolute bottom-full left-0 right-0 z-10 bg-background/60 backdrop-blur-sm">
          <Image
            key={filePreview}
            src={filePreview}
            alt="img"
            width={128}
            height={0}
            sizes="100vw"
            unoptimized
            loading="lazy"
            className="w-32 h-auto object-cover rounded-lg"
          />
          <button
            onClick={handleFilePreviews}
            className="absolute top-4 right-4"
          >
            <X size={18} />
          </button>
        </div>
      )}
      <div className="p-4 border-t border-t-border">
        <form onSubmit={onSubmit} className="flex items-center gap-4">
          <input
            type="file"
            hidden
            accept="image/*"
            ref={inputFileRef}
            onChange={(e) => setFile(e.target.files?.[0] as File)}
          />
          <button type="button" onClick={() => inputFileRef.current?.click()}>
            <Paperclip size={20} />
          </button>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            type="text"
            className="flex-1 px-4 py-1.5 rounded-full border border-border"
            placeholder="Typing..."
          />
          <button
            className="disabled:cursor-no-drop! disabled:opacity-50"
            disabled={(!file && !content) || isPending}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageForm;
