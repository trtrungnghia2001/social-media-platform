"use client";
import Feed from "@/components/Feed";
import { ArrowLeft, CalendarDays, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const ProfilePage = () => {
  const params = useParams();
  const username = params.username as string;
  return (
    <div>
      {/* top nav */}
      <div className="z-50 sticky top-0 p-4 flex items-center gap-4 backdrop-blur-xl">
        <button onClick={() => history.back()} className="btn-options">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h3>Trần Trung Nghĩa</h3>
          <p className="text-xs text-secondary">1 post</p>
        </div>
      </div>
      {/* info */}
      <div className="relative mb-16">
        <Image
          alt="bg"
          src={
            "https://pbs.twimg.com/profile_banners/1504011781420699651/1766128526/1080x360"
          }
          loading="lazy"
          width={1280}
          height={360}
          unoptimized
        />
        <div className="absolute bottom-0 translate-y-1/2 left-4 right-4 flex items-center justify-between gap-4">
          <div className="bg-background rounded-full p-1 border border-border">
            <Image
              alt="avatar"
              src={
                "https://pbs.twimg.com/profile_images/2001914859773202432/Bsabgg43_400x400.jpg"
              }
              loading="lazy"
              width={128}
              height={128}
              unoptimized
              className="rounded-full"
            />
          </div>
          <div className="pt-12 flex-1 flex justify-end flex-wrap gap-2">
            {username === "user_1" ? (
              <>
                <button className="block btn font-bold">Edit profile</button>
              </>
            ) : (
              <>
                <button className="block btn font-bold">Message</button>
                <button className="block btn font-bold">Follow</button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div>
          <h2>Trần Trung Nghĩa</h2>
          <p className="text-13 text-secondary">@Tr_TrungNghia</p>
        </div>
        <div
          className="whitespace-break-spaces"
          dangerouslySetInnerHTML={{
            __html: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sequi numquam repudiandae optio harum molestias cumque eligendi! Dicta aperiam eius asperiores, earum, officia, optio rem deleniti cumque corporis architecto id consequatur.`,
          }}
        />
        <div className="text-sm text-secondary flex items-center gap-4">
          <div className="flex items-center gap-2">
            <LinkIcon size={16} className="inline-block" />
            <Link
              href={`patreon.com/jared999d`}
              className="text-blue-500 underline"
            >
              patreon.com/jared999d
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="inline-block" />
            Join at {new Date(`11/11/2026`).toLocaleDateString()}
          </div>
        </div>
        <div className="space-x-4 text-sm text-secondary">
          <span>100 following</span>
          <span>100 follower</span>
        </div>
      </div>
      <Feed />
    </div>
  );
};

export default ProfilePage;
