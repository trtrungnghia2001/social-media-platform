import { IMAGE_DEFAULT } from "@/helpers/constants";
import { formatTimeAgo, getNotificationText } from "@/helpers/utils";
import { getNotifications } from "@/lib/actions";
import Image from "next/image";
import Link from "next/link";

const NotificationsPage = async () => {
  const notifications = await getNotifications({});

  return (
    <div className="p-4">
      <h2 className="mb-4">Notifications</h2>
      {notifications.map((notifi) => (
        <div
          key={notifi.id}
          className="hover:bg-secondaryBg rounded-lg py-2 px-4 flex items-start gap-4"
        >
          <Image
            unoptimized
            alt="avatar"
            src={notifi.issuer.avatarUrl || IMAGE_DEFAULT.AVATAR}
            width={40}
            height={40}
            className="img rounded-full"
          />
          <div className="flex-1">
            <div>
              <Link
                href={`/user/` + notifi.issuer.username}
                className="font-semibold"
              >
                {notifi.issuer.name}
              </Link>{" "}
              {getNotificationText(notifi.type)}{" "}
              {notifi.type !== "FOLLOW" && (
                <Link href={`/`} className="text-13 underline text-blue-500">
                  View post
                </Link>
              )}
            </div>
            <div className="text-secondary text-13">
              {formatTimeAgo(new Date(notifi.createdAt))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationsPage;
