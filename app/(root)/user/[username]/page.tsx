import ButtonHistoryBack from "@/components/ButtonHistoryBack";
import Feed from "@/components/Feed";
import OnlineStatus from "@/components/OnlineStatus";
import ProfileActions from "@/components/ProfileActions";
import { IMAGE_DEFAULT } from "@/helpers/constants";
import { getOptionalAuth, getUserByUsername } from "@/lib/actions";
import { CalendarDays, LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const ProfilePage = async ({
  params,
}: {
  params: Promise<{ username: string }>;
}) => {
  const { username } = await params;
  const user = await getUserByUsername(username);
  const auth = await getOptionalAuth();

  if (!user) return notFound();

  return (
    <div>
      {/* top nav */}
      <div className="z-10 sticky top-0 p-4 flex items-center gap-4 backdrop-blur-xl">
        <ButtonHistoryBack />
        <div className="space-y-1">
          <h3>{user.name}</h3>
          <p className="text-13 text-secondary">{user._count.posts} posts</p>
        </div>
      </div>
      {/* info */}
      <div className="relative mb-16">
        <Image
          alt="bg"
          src={user.backgroundUrl || IMAGE_DEFAULT.BACKGROUND}
          loading="lazy"
          width={1280}
          height={360}
          unoptimized
          className="img w-full max-h-48"
        />
        <div className="absolute bottom-0 translate-y-1/2 left-4 right-4 flex items-center justify-between gap-4">
          <div className="bg-background rounded-full p-1 border border-border relative">
            <Image
              alt="avatar"
              src={user.avatarUrl || IMAGE_DEFAULT.AVATAR}
              loading="lazy"
              width={128}
              height={128}
              unoptimized
              className="rounded-full img"
            />
            <OnlineStatus userId={user.id} className="bottom-4 right-4" />
          </div>
          <ProfileActions
            user={user}
            isFollowing={user.isFollowing}
            auth={auth}
            className="mt-12"
          />
        </div>
      </div>
      <div className="p-4 space-y-2">
        <div>
          <h2>{user.name}</h2>
          <p className="text-13 text-secondary">@{user.username}</p>
        </div>
        {user.bio && (
          <div
            className="whitespace-break-spaces"
            dangerouslySetInnerHTML={{
              __html: user.bio,
            }}
          />
        )}
        <div className="text-sm text-secondary flex flex-wrap items-center gap-x-4 gap-y-2">
          {user.websiteUrl && (
            <div className="flex items-center gap-2">
              <LinkIcon size={16} className="inline-block" />
              <Link href={user.websiteUrl} className="text-blue-500 underline">
                {user.websiteUrl}
              </Link>
            </div>
          )}
          {user.createdAt && (
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="inline-block" />
              Join at {new Date(user.createdAt).toLocaleDateString()}
            </div>
          )}
        </div>
        <div className="space-x-4 text-sm text-secondary">
          <span>{user._count.followings} following</span>
          <span>{user._count.followers} follower</span>
        </div>
      </div>
      <Feed username={username} />
    </div>
  );
};

export default ProfilePage;
