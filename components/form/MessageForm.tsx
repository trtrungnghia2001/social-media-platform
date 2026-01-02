"use client";
import { useAuthContext } from "@/contexts/AuthContext";
import { useSocketContext } from "@/contexts/SocketContext";
import { uploadToCloudinary } from "@/helpers/utils";
import { createMessage } from "@/lib/actions";
import { CloudUpload, Loader, Send, X } from "lucide-react";
import Image from "next/image";
import {
  memo,
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

const MessageForm = () => {
  const { handleSendMessage, currentUser, setMessages } = useSocketContext();
  const [text, setText] = useState("");
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

  const { auth } = useAuthContext();

  const [_, formAction, isLoading] = useActionState(
    async (_: unknown, formData: FormData) => {
      const text = formData.get("text") as string;
      const file = formData.get("file") as File | null;

      const hasFile = file && file.size > 0;
      if ((!text.trim() && !hasFile) || !auth) return;

      try {
        let mediaUrl = "";
        if (hasFile) {
          mediaUrl = await uploadToCloudinary(file);
        }

        if (currentUser) {
          const data = await createMessage({
            text,
            mediaUrl,
            receiverId: currentUser.id,
          });

          setMessages((prev) => [...prev, data]);
          handleSendMessage(data);
        }

        setText("");
        setFile(null);
        if (inputFileRef.current) {
          inputFileRef.current.value = "";
        }
      } catch (error) {
        toast.error("Created failed!");
        console.error(error);
      }
    },
    null
  );

  if (!auth) return null;
  return (
    <div className="relative border-t border-t-border">
      {/* file */}
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
      {/* form */}
      <form action={formAction} className="flex items-center gap-2 p-4">
        <button
          className="btn-options"
          type="button"
          onClick={() => inputFileRef.current?.click()}
        >
          <CloudUpload size={18} />
        </button>
        <input
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Typing..."
          type="text"
          className="px-3 py-1.5 rounded-full border border-border flex-1 outline-none transition-all"
        />
        <input
          name="file"
          type="file"
          hidden
          ref={inputFileRef}
          onChange={(e) => {
            const selectedFile = e.target.files?.[0];
            if (selectedFile) {
              setFile(selectedFile);
            }
          }}
        />
        <button
          type="submit"
          className="btn-options"
          disabled={(!text && !file) || isLoading}
        >
          {isLoading ? (
            <Loader size={16} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
        </button>
      </form>
    </div>
  );
};

export default memo(MessageForm);
