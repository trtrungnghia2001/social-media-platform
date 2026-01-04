import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const onlineUsers = new Map();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    // connect and disconnect
    console.log(`Socket client connect::`, socket.id);

    const userId = socket.handshake.auth.userId;
    if (userId) {
      onlineUsers.set(userId, socket.id);
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    }

    socket.on("disconnect", () => {
      if (userId) {
        onlineUsers.delete(userId);
        io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
      }
    });

    // notifications
    socket.on("sendNotification", async ({ data, recipientId }) => {
      const recipientIdSocket = onlineUsers.get(recipientId);

      if (recipientIdSocket) {
        io.to(recipientIdSocket).emit("sendNotification", data);
      }
    });
    // chat
    socket.on("send-message", ({ receiverId, mess }) => {
      const recipientIdSocket = onlineUsers.get(receiverId);
      if (recipientIdSocket) {
        io.to(recipientIdSocket).emit("receiver-message", mess);
      }
    });
    socket.on("mark-as-read", ({ senderId, receiverId }) => {
      const recipientIdSocket = onlineUsers.get(receiverId);
      if (recipientIdSocket) {
        io.to(recipientIdSocket).emit("message-read", { readBy: senderId });
      }
    });

    // --- WebRTC Video Call Logic ---

    // 1. Chuyển tiếp Offer (Lời mời gọi)
    socket.on("send-offer", ({ to, from, offer }) => {
      const recipientSocketId = onlineUsers.get(to.id);
      if (recipientSocketId) {
        console.log(`Đang chuyển Offer từ ${from} tới ${to}`);
        io.to(recipientSocketId).emit("receive-offer", { from, offer });
      }
    });

    // 2. Chuyển tiếp Answer (Lời chấp nhận)
    socket.on("send-answer", ({ to, answer }) => {
      const recipientSocketId = onlineUsers.get(to);
      if (recipientSocketId) {
        console.log(`Đang chuyển Answer tới ${to}`);
        io.to(recipientSocketId).emit("receive-answer", { answer });
      }
    });

    // 3. Chuyển tiếp ICE Candidate (Địa chỉ mạng)
    socket.on("send-ice", ({ to, candidate }) => {
      const recipientSocketId = onlineUsers.get(to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receive-ice", { candidate });
      }
    });

    // 4. (Tùy chọn) Báo kết thúc cuộc gọi
    socket.on("end-call", ({ to }) => {
      const recipientSocketId = onlineUsers.get(to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("call-ended");
      }
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
