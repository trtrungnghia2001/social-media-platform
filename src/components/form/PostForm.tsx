"use client";

import { useAuthStore } from "@/src/stores/auth.store";
import Image from "next/image";
import { memo } from "react";
import {
  Image as Images,
  Smile,
  BarChart3,
  MapPin,
  CalendarClock,
  AudioLines,
} from "lucide-react";
import Link from "next/link";

const PostForm = () => {
  const { auth } = useAuthStore();
  if (!auth) return;
  return (
    <div className="flex items-start gap-2 p-4">
      <Link
        href={`/` + auth.username}
        className="block w-8 aspect-square overflow-hidden rounded-full relative"
      >
        <Image src={auth.avatarUrl} alt="avatar" loading="lazy" fill />
      </Link>
      <div className="flex-1 overflow-hidden">
        <form>
          <textarea
            rows={3}
            placeholder="What is happening?"
            className="border-none outline-none w-full"
          />
          <div className="mt-2 flex items-center justify-between gap-4">
            <div className="text-blue-500 space-x-2">
              <button type="button">
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
            <button type="button" className="btn ">
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(PostForm);
