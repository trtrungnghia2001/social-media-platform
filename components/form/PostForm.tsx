"use client";
import Image from "next/image";
import Link from "next/link";
import {
  Image as ImageIcon,
  FileCheck,
  ListTodo,
  Smile,
  CalendarClock,
  MapPin,
  X,
} from "lucide-react";
import { ChangeEvent, memo, useEffect, useMemo, useRef, useState } from "react";

const PostForm = () => {
  const postFormIcons = [
    {
      icon: ImageIcon,
      label: "Media",
      color: "text-sky-500",
    },
    { icon: FileCheck, label: "GIF", color: "text-sky-500" },
    { icon: ListTodo, label: "Poll", color: "text-sky-500" },
    { icon: Smile, label: "Emoji", color: "text-sky-500" },
    {
      icon: CalendarClock,
      label: "Schedule",
      color: "text-sky-500",
    },
    {
      icon: MapPin,
      label: "Location",
      color: "text-sky-500",
      disabled: true,
    },
  ];

  const [text, setText] = useState("");
  //   file
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const filePreview = useMemo(() => {
    if (!file) return "";
    const url = URL.createObjectURL(file);
    return url;
  }, [file]);
  useEffect(() => {
    if (filePreview) {
      return () => {
        URL.revokeObjectURL(filePreview);
      };
    }
  }, [filePreview]);

  const handleIconClick = (label: string) => {
    if (label === "Media") {
      inputFileRef.current?.click();
    }
  };

  const onSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file && !text) return;
    console.log({ file, text });
  };

  return (
    <div className="p-4 flex items-start gap-4">
      <Link href={`/user/user_1`}>
        <Image
          alt="avatar"
          src={
            "https://pbs.twimg.com/profile_images/2001914859773202432/Bsabgg43_400x400.jpg"
          }
          loading="lazy"
          width={40}
          height={40}
          unoptimized
          className="rounded-full"
        />
      </Link>
      <form onSubmit={onSubmit} className="flex-1 space-y-2">
        <textarea
          name="text"
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What is happening?"
          className="w-full border-none outline-none"
          rows={3}
        ></textarea>
        <div className="flex items-center justify-between gap-4">
          <input
            type="file"
            ref={inputFileRef}
            hidden
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) {
                setFile(selectedFile);
                e.target.value = "";
              }
            }}
          />
          <div>
            {postFormIcons.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  handleIconClick(item.label);
                }}
                type="button"
                className={`p-2 rounded-full hover:bg-sky-500/10 transition-colors ${
                  item.color
                } ${item.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                title={item.label}
              >
                <item.icon size={16} strokeWidth={2} />
              </button>
            ))}
          </div>
          <button className="btn" disabled={!text && !file}>
            Post
          </button>
        </div>
        {filePreview && (
          <div className="border-t border-t-border pt-2 relative">
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
      </form>
    </div>
  );
};

export default memo(PostForm);
