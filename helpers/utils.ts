import { NotificationType } from "@/app/generated/prisma";

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Dưới 1 phút
  if (diffInSeconds < 60) return "just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  // Nếu quá 7 ngày thì hiển thị ngày tháng (Ví dụ: Jan 26)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export const uploadToCloudinary = async (file: File) => {
  const cloud_name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME as string;
  const upload_preset = process.env
    .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string;

  const resourceType = file.type.startsWith("video") ? "video" : "image";

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", upload_preset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("Cloudinary Error:", data.error?.message);
    throw new Error(data.error?.message || "Upload failed");
  }

  return data.secure_url;
};

export const getNotificationText = (
  type: NotificationType,
  content?: string
) => {
  switch (type) {
    case NotificationType.LIKE:
      return "liked your post.";
    case NotificationType.COMMENT:
      return content ? `commented: "${content}"` : "commented on your post.";
    case NotificationType.FOLLOW:
      return "started following you.";
    case NotificationType.REPOST:
      return "reposted your post.";
    case NotificationType.MENTION:
      return "mentioned you in a post.";
    default:
      return "interacted with you.";
  }
};

export const playNotificationSound = () => {
  const audio = new Audio("/sounds/notification.mp3");
  audio.volume = 0.4;

  const playPromise = audio.play();

  if (playPromise !== undefined) {
    playPromise.catch((error) => {
      console.log("Autoplay bị chặn, cần user tương tác trước:", error);
    });
  }
};
