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
