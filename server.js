import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log(`client connect socket::`, socket.id);
    const authId = socket.handshake.auth.authId;
    if (authId) {
      onlineUsers.set(authId, socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    }
    socket.on("disconnect", () => {
      if (authId && onlineUsers.has(authId)) {
        onlineUsers.delete(authId);
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      }
    });

    //
    socket.on("post-active", (value) => {
      const authorId = value.userId;
      if (authorId && onlineUsers.has(authorId)) {
        console.log({ value });

        io.to(onlineUsers.get(authorId)).emit(`post-active`, value);
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
