"use client";

import { useAuthStore } from "@/src/stores/auth.store";
import Image from "next/image";
import { FormEvent, memo, useEffect, useMemo, useRef, useState } from "react";
import {
  Image as Images,
  Smile,
  BarChart3,
  MapPin,
  CalendarClock,
  AudioLines,
  X,
} from "lucide-react";
import Link from "next/link";
import { IMAGES_DEFAULT } from "@/src/constants/img";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createPost } from "@/lib/post";
import { usePostStore } from "@/src/stores/post.store";
import { uploadToCloudinary } from "@/src/utils/upload";

const PostForm = () => {
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

  const { auth } = useAuthStore();
  const { create } = usePostStore();
  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (auth) {
        let mediaUrl = "";
        if (file) {
          mediaUrl = await uploadToCloudinary(file);
        }
        await create({
          authorId: auth.id,
          content: content,
          mediaUrl: mediaUrl,
        });
        setContent("");
        setFile(null);
      }
    },
    onSuccess: () => toast.success("Created post successfully!"),
    onError: (err) => toast.error(err.message),
  });

  if (!auth) return null;
  return (
    <div>
      <div className="flex items-start gap-4 p-4">
        <Link href={`/` + auth.username} className="block">
          <Image
            src={auth.avatarUrl || IMAGES_DEFAULT.AVATAR}
            alt="avatar"
            loading="lazy"
            width={40}
            height={40}
            className="object-center object-cover rounded-full"
          />
        </Link>
        <div className="flex-1 overflow-hidden">
          <form onSubmit={onSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="What is happening?"
              className="border-none outline-none w-full"
            />
            <div className="mt-2 flex items-center justify-between gap-4">
              <div className="text-blue-500 space-x-2">
                <input
                  type="file"
                  ref={inputFileRef}
                  onChange={(e) => setFile(e.target.files?.[0] as File)}
                  hidden
                  accept="image/*"
                />
                <button
                  onClick={() => inputFileRef.current?.click()}
                  type="button"
                >
                  <Images size={18} />
                </button>
                <button type="button">
                  <Smile size={18} />
                </button>
                <button type="button">
                  <BarChart3 size={18} />
                </button>
                <button type="button">
                  <MapPin size={18} />
                </button>
                <button type="button">
                  <CalendarClock size={18} />
                </button>
                <button type="button">
                  <AudioLines size={18} />
                </button>
              </div>
              <button
                type="submit"
                className="btn font-bold"
                disabled={(!file && !content) || isPending}
              >
                Post
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* preview */}
      {filePreview && (
        <div className="flex flex-wrap gap-2 p-4 border-t border-border relative">
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
    </div>
  );
};

export default memo(PostForm);
