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
  Loader,
} from "lucide-react";
import {
  memo,
  useActionState,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createComment } from "@/lib/actions";
import { uploadToCloudinary } from "@/helpers/utils";
import toast from "react-hot-toast";
import { useAuthContext } from "@/contexts/AuthContext";
import { IMAGE_DEFAULT } from "@/helpers/constants";
import { useSocketContext } from "@/contexts/SocketContext";
import { useCommentContext } from "@/contexts/CommentContext";

const CommentForm = ({
  postId,
  parentCommentId,
}: {
  postId: string;
  parentCommentId?: string;
}) => {
  const commentFormIcons = [
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

  const { auth } = useAuthContext();
  const { handleNotification } = useSocketContext();
  const { setAllComments } = useCommentContext();

  const [_, formAction, isLoading] = useActionState(
    async (_: unknown, formData: FormData) => {
      if (!auth) {
        toast.error(`Please log in!`);
        return;
      }
      const text = formData.get("text") as string;
      const file = formData.get("file") as File | null;

      const hasFile = file && file.size > 0;
      if ((!text.trim() && !hasFile) || !auth) return;

      try {
        let mediaUrl = "";
        if (hasFile) {
          mediaUrl = await uploadToCloudinary(file);
        }

        const { comment, notifi } = await createComment({
          text,
          mediaUrl,
          postId,
          parentCommentId,
        });
        if (comment) {
          setAllComments((prev) => [comment, ...prev]);
        }

        if (notifi) {
          handleNotification({ recipientId: notifi.recipientId, data: notifi });
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

  return (
    <div className="border-t border-t-border p-4 flex items-start gap-4">
      <Link href={`/user/` + auth?.username}>
        <Image
          alt="avatar"
          src={auth?.avatarUrl || IMAGE_DEFAULT.AVATAR}
          loading="lazy"
          width={40}
          height={40}
          unoptimized
          className="rounded-full"
        />
      </Link>
      <form action={formAction} className="flex-1 space-y-2">
        <textarea
          name="text"
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Post your reply"
          className="w-full border-none outline-none"
          rows={3}
        ></textarea>
        <div className="flex items-center justify-between gap-4">
          <input
            name="file"
            type="file"
            ref={inputFileRef}
            hidden
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) {
                setFile(selectedFile);
              }
            }}
          />
          <div>
            {commentFormIcons.map((item, index) => (
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
          <button className="btn" disabled={(!text && !file) || isLoading}>
            {isLoading ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              `Reply`
            )}
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

export default memo(CommentForm);
