"use client";
import { getUser } from "@/lib/user";
import Feed from "@/src/components/Feed";
import ProfileForm from "@/src/components/form/ProfileForm";
import { IMAGES_DEFAULT } from "@/src/constants/img";
import { useAuthStore } from "@/src/stores/auth.store";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

const UserName = () => {
  const params = useParams();
  const username = params.username as string;
  const { data, isLoading } = useQuery({
    queryKey: ["user", username],
    queryFn: async () => await getUser(username),
    enabled: !!username,
  });
  const { auth } = useAuthStore();
  const [openEditForm, setOpenEditForm] = useState(false);

  const userDetail = useMemo(() => {
    return data?.user || null;
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (!userDetail) return <div>Error</div>;

  return (
    <div>
      {openEditForm && (
        <ProfileForm open={openEditForm} setOpen={setOpenEditForm} />
      )}
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
          <p className="text-13 text-secondary">{data?.postTotals} post</p>
        </div>
      </div>
      <div className="bg-secondary-bg relative mb-16 w-full h-52">
        {userDetail.backgroundUrl && (
          <Image
            src={userDetail.backgroundUrl}
            alt="thumbnail"
            fill
            className="object-cover object-center"
          />
        )}
        <div className="absolute bottom-0 left-4 right-4 translate-y-1/2 flex items-center justify-between gap-4">
          <div className="rounded-full overflow-hidden p-1 bg-background">
            <Image
              src={userDetail.avatarUrl || IMAGES_DEFAULT.AVATAR}
              alt="avatar"
              width={128}
              height={128}
              sizes="100vw"
              className="rounded-full object-center object-cover overflow-hidden aspect-square"
            />
          </div>
          {auth?.username === username && (
            <button
              onClick={() => setOpenEditForm(true)}
              className="mt-16 btn font-bold"
            >
              Edit profile
            </button>
          )}
        </div>
      </div>
      {/* info */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-xl leading-2">{userDetail.name}</h3>
        <p className="text-secondary">@{userDetail.username}</p>
        <div
          className="whitespace-break-spaces"
          dangerouslySetInnerHTML={{
            __html: userDetail.bio || "",
          }}
        />
        <div className="flex flex-wrap items-center gap-4">
          {userDetail.websiteUrl && (
            <div className="text-secondary flex items-center gap-2">
              <LinkIcon size={16} />
              <Link
                href={userDetail.websiteUrl}
                className="underline text-blue-500"
              >
                {userDetail.websiteUrl}
              </Link>
            </div>
          )}
          <div className="text-secondary flex items-center gap-2">
            <CalendarDays size={16} /> Join in {new Date().toDateString()}
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
      <Feed username={username} />
    </div>
  );
};

export default UserName;
