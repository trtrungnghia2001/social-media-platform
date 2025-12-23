"use client";
import { Notification, NotificationType } from "@/app/generated/prisma";
import { getNotifications, readNotification } from "@/lib/notification";
import { IMAGES_DEFAULT } from "@/src/constants/img";
import { queryClient } from "@/src/contexts/Provider";
import { useSocket } from "@/src/contexts/useSocket";
import { useAuthStore } from "@/src/stores/auth.store";
import { formatTimeAgo } from "@/src/utils/time";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import toast from "react-hot-toast";

const NotificationPage = () => {
  const { setNotifications, notifications } = useSocket();
  const { auth } = useAuthStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () =>
      await getNotifications({ currentUserId: auth?.id as string }),
    enabled: !!auth,
  });
  const getNotificationContent = (type: NotificationType) => {
    switch (type) {
      case "FAVORITE":
        return "đã thích bài viết của bạn";
      case "BOOKMARK":
        return "đã lưu bài viết của bạn";
      case "SHARE":
        return "đã chia sẻ bài viết của bạn";
      case "COMMENT":
        return "đã bình luận về bài viết của bạn";
      case "FOLLOW":
        return "đã bắt đầu theo dõi bạn";
      default:
        return "đã tương tác với bạn";
    }
  };
  const { mutate } = useMutation({
    mutationFn: async (notiId: string) => await readNotification(notiId),

    onSuccess: (_, notiId) => {
      setNotifications(Math.max(0, notifications - 1));
      queryClient.setQueryData(
        ["notifications"],
        (oldData: { notifications: Notification[] }) => {
          if (!oldData) return oldData;

          const notifications = oldData.notifications.map((n) =>
            n.id === notiId ? { ...n, isRead: true } : n
          );

          return { ...oldData, notifications };
        }
      );
    },
    onError: (error) => toast.error(error.message),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return error.message;

  return (
    <div className="p-4">
      <ul className="space-y-4">
        {data?.notifications.map((noti) => (
          <li
            key={noti.id}
            onClick={() => {
              if (noti.isRead) return;
              mutate(noti.id);
            }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg bg-secondary-bg`}
          >
            <Image
              alt={noti.issuer.name}
              src={noti.issuer.avatarUrl || IMAGES_DEFAULT.AVATAR}
              loading="lazy"
              width={45}
              height={45}
              className="rounded-full object-cover"
            />
            <div className="flex flex-col flex-1">
              <p className="text-sm leading-tight">
                <span className="font-bold hover:underline cursor-pointer">
                  {noti.issuer.name}
                </span>{" "}
                <span className="text-gray-400">
                  {getNotificationContent(noti.type)}
                </span>
              </p>

              <span className="text-[11px] text-gray-500 mt-1">
                {formatTimeAgo(noti.createdAt.toString())}
              </span>
            </div>

            {!noti.isRead && (
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPage;
