import { AuthType } from "./auth.store";

export type MessageType = {
  id: string;
  senderId: string; // ID người gửi
  receiverId: string; // ID người nhận
  content?: string; // Nội dung văn bản (optional nếu gửi ảnh)
  mediaUrl?: string; // Link ảnh từ Cloudinary (nếu có)
  isRead: boolean; // Trạng thái đã xem
  createdAt: string; // Thời gian gửi để sắp xếp tin nhắn
};

export type ContactType = AuthType & {
  lastMessage?: MessageType;
};
