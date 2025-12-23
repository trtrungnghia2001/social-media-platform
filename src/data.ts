import { AuthType } from "./stores/auth.store";
import { ContactType, MessageType } from "./stores/message.store";
import { PostType } from "./stores/post.store";

export const user: AuthType = {
  id: "u1",
  name: "Tran Trung Nghia",
  username: "Tr_TrungNghia",
  avatarUrl:
    "https://pbs.twimg.com/profile_images/2001914859773202432/Bsabgg43_400x400.jpg",
  backgroundUrl:
    "https://pbs.twimg.com/profile_banners/1504011781420699651/1766128526/1080x360",
  websiteUrl: "patreon.com/jared999d",
  bio: `Hi. I am Jared999D!<br/>No commissions.`,
};

// post
export const MOCK_USERS: AuthType[] = [
  {
    id: "u1",
    name: "Tran Trung Nghia",
    username: "Tr_TrungNghia",
    avatarUrl:
      "https://pbs.twimg.com/profile_images/2001914859773202432/Bsabgg43_400x400.jpg",
    backgroundUrl:
      "https://pbs.twimg.com/profile_banners/1504011781420699651/1766128526/1080x360",
    websiteUrl: "patreon.com/jared999d",
    bio: `Hi. I am Jared999D!<br/>No commissions.`,
  },
  {
    id: "u2",
    name: "Gemini AI",
    username: "gemini_assistant",
    avatarUrl: "https://i.pravatar.cc/150?u=u1",
    backgroundUrl: "https://picsum.photos/seed/bg1/800/400",
    bio: "I am a helpful AI thought partner.",
    websiteUrl: "https://gemini.google.com",
  },
  {
    id: "u3",
    name: "Trần Thế Trung",
    username: "trunghandsome",
    avatarUrl: "https://i.pravatar.cc/150?u=u2",
    backgroundUrl: "https://picsum.photos/seed/bg2/800/400",
    bio: "Fullstack Developer in the making 🚀",
    websiteUrl: "https://github.com/trunghandsome",
  },
  {
    id: "u4",
    name: "NextJS Vietnam",
    username: "nextjs_vn",
    avatarUrl: "https://i.pravatar.cc/150?u=u3",
    bio: "Cộng đồng Next.js lớn nhất Việt Nam 🇻🇳",
  },
];

const SAMPLE_CONTEXTS = [
  "Vừa setup xong Prisma 7 trên Windows, chạy mượt mà không lỗi EPERM!",
  "Anh em đã thử Cloudinary để upload ảnh trong Next.js chưa?",
  "Mạng xã hội này dùng PostgreSQL làm database thì quá chuẩn.",
  "Hôm nay trời đẹp, làm vài dòng code rồi đi cafe thôi. ☕",
  "Ai biết cách fix lỗi Hydration Mismatch trong Next.js 15 không?",
  "Đang viết script test database, mong là mọi thứ ổn định.",
  "Dự án cá nhân đầu tay, tuy đơn giản nhưng tự hào lắm.",
  "Tailwind CSS v4 sắp ra mắt, anh em có hóng không?",
  "Học React 19 thấy Server Actions thực sự thay đổi cuộc chơi.",
  "Code xuyên màn đêm để kịp deadline ngày mai... 😴",
];

export const MOCK_POSTS: PostType[] = Array.from({ length: 40 }).map(
  (_, index) => {
    const user = MOCK_USERS[index % MOCK_USERS.length];
    const hasImage = Math.random() > 0.3;

    // Logic tạo thời gian lùi dần:
    const now = new Date();
    let createdAt: string;

    if (index === 0) {
      // Post đầu tiên: vừa mới đăng xong (10 giây trước)
      now.setSeconds(now.getSeconds() - 10);
      createdAt = now.toISOString();
    } else if (index < 5) {
      // 5 Post tiếp theo: đăng trong vòng 1 giờ qua (mấy phút trước)
      now.setMinutes(now.getMinutes() - index * 8);
      createdAt = now.toISOString();
    } else if (index < 15) {
      // Các post tiếp theo: đăng vài giờ trước
      now.setHours(now.getHours() - (index - 4));
      createdAt = now.toISOString();
    } else {
      // Các post cũ hơn: đăng từ 1 đến vài ngày trước
      now.setDate(now.getDate() - Math.floor(index / 5));
      createdAt = now.toISOString();
    }

    return {
      id: `p${index + 1}`,
      author: user,
      content:
        SAMPLE_CONTEXTS[index % SAMPLE_CONTEXTS.length] +
        ` (Post #${index + 1})`,
      mediaUrl: hasImage ? `https://picsum.photos/seed/${index}/800/600` : "",
      totalComments: Math.floor(Math.random() * 50),
      totalShares: Math.floor(Math.random() * 20),
      totalFavorites: Math.floor(Math.random() * 300),
      isShare: Math.random() > 0.8,
      isFavorite: Math.random() > 0.5,
      isBookmark: Math.random() > 0.7,
      createdAt: createdAt, // Thời gian đã được xử lý đa dạng
    };
  }
);

// messages
export const MOCK_MESSAGES: MessageType[] = [
  {
    id: "m1",
    senderId: "u1",
    receiverId: "u2",
    content: "Chào Trung! Bạn đã setup xong Prisma chưa?",
    isRead: true,
    createdAt: "2025-12-21T08:00:00Z",
  },
  {
    id: "m2",
    senderId: "u2",
    receiverId: "u1",
    content: "Chào Gemini, mình vừa xong rồi. Giờ đang làm đến phần Chat!",
    isRead: true,
    createdAt: "2025-12-21T08:02:00Z",
  },
  {
    id: "m3",
    senderId: "u1",
    receiverId: "u2",
    content: "Tuyệt vời! Bạn có cần mình hỗ trợ về Socket.io hay Pusher không?",
    isRead: true,
    createdAt: "2025-12-21T08:05:00Z",
  },
  {
    id: "m4",
    senderId: "u2",
    receiverId: "u1",
    mediaUrl: "https://picsum.photos/seed/chat1/400/300",
    content: "Đây là giao diện mình vừa code xong nè.",
    isRead: false,
    createdAt: "2025-12-21T08:10:00Z",
  },
  // Bạn có thể dùng Array.from để tạo thêm tin nhắn nếu cần test scroll
].concat(
  Array.from({ length: 16 }).map((_, i) => ({
    id: `m-extra-${i}`,
    senderId: i % 2 === 0 ? "u1" : "u2",
    receiverId: i % 2 === 0 ? "u2" : "u1",
    content: `Tin nhắn tự động thứ ${i + 1} để test giao diện scroll chat.`,
    isRead: true,
    createdAt: new Date(Date.now() + i * 1000).toISOString(),
  }))
);

// contact
export const MOCK_CONTACTS: ContactType[] = Array.from({ length: 40 }).map(
  (_, index) => ({
    id: `u${index + 1}`,
    name: `User thứ ${index + 1}`,
    username: `user_name_${index + 1}`,
    avatarUrl: `https://i.pravatar.cc/150?u=${index + 1}`,
    bio: "Testing scroll side bar chat...",
    lastMessage: {
      id: `m-last-${index}`,
      senderId: index % 2 === 0 ? `u${index + 1}` : "u2", // u2 là chính mình
      receiverId: index % 2 === 0 ? "u2" : `u${index + 1}`,
      content:
        index === 0
          ? "Tin nhắn mới nhất nằm đây nè bro! 🔥"
          : `Nội dung tin nhắn cuối cùng của user ${index + 1}`,
      isRead: index > 5, // 5 người đầu tiên có tin nhắn chưa đọc
      createdAt: new Date(Date.now() - index * 100000).toISOString(),
    },
  })
);
