"use client";
import Feed from "@/src/components/Feed";
import { ArrowLeft, CalendarDays, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const UserName = () => {
  return (
    <div>
      {/* top */}
      <div className="px-4 py-2 z-10 flex items-center gap-4 sticky top-0 bg-background/80 backdrop-blur">
        <button
          onClick={() => {
            history.back();
          }}
          className="p-2 rounded-full hover:bg-secondary-bg"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h3 className="font-bold text-xl">Trần Trung Nghĩa</h3>
          <p className="text-13 text-secondary">1 post</p>
        </div>
      </div>
      <div className="bg-secondary-bg relative mb-16">
        <Image
          src={`https://pbs.twimg.com/profile_banners/1504011781420699651/1766128526/1080x360`}
          alt="thumbnail"
          width={1080}
          height={200}
          sizes="100vw"
          className="w-full h-auto object-cover object-center"
        />
        <div className="absolute bottom-0 left-4 right-4 translate-y-1/2 flex items-center justify-between gap-4">
          <div className="rounded-full overflow-hidden p-1 bg-background">
            <Image
              src={`https://pbs.twimg.com/profile_images/2001914859773202432/Bsabgg43_400x400.jpg`}
              alt="avatar"
              width={1080}
              height={200}
              sizes="100vw"
              className="w-32 aspect-square rounded-full object-cover object-center"
            />
          </div>
          <button className="mt-16 btn">Edit profile</button>
        </div>
      </div>
      {/* info */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-xl leading-2">Trần Trung Nghĩa</h3>
        <p className="text-secondary">@Tr_TrungNghia</p>
        <div
          className="whitespace-break-spaces"
          dangerouslySetInnerHTML={{
            __html: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum accusantium aspernatur similique dolorum ex nobis, quam distinctio, rem ut sequi, odit velit nam nemo hic modi. Incidunt eaque impedit tenetur.`,
          }}
        />
        <div className="flex flex-wrap items-center gap-4">
          <div className="text-secondary flex items-center gap-2">
            <LinkIcon size={16} />
            <Link
              href={`https://trungnghia-dev.vercel.app/`}
              className="underline text-blue-500"
            >
              https://trungnghia-dev.vercel.app/
            </Link>
          </div>
          <div className="text-secondary flex items-center gap-2">
            <CalendarDays size={16} /> Join in June 2022
          </div>
        </div>
        <div className="flex items-center gap-4">
          <p>
            <span className="font-semibold">100</span>{" "}
            <span className="text-secondary">Following</span>
          </p>
          <p>
            <span className="font-semibold">200</span>{" "}
            <span className="text-secondary">Followers</span>
          </p>
        </div>
      </div>
      {/* feed */}
      <Feed />
    </div>
  );
};

export default UserName;
