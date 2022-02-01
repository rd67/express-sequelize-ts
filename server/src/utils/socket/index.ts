import { Socket } from "socket.io";
import { Server } from "http";
import chalk from "chalk";

import { SocketAuthHandler } from "@middlewares/auth";

import { UserInstance } from "@models/users";

import * as helpers from "./helpers";

export default (server: Server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  const name = chalk.cyan("🌿Socket");
  console.log(`${name} Connection established successfully.`);

  io.use(SocketAuthHandler).on("connection", function (socket: Socket) {
    const user = socket.data.user as UserInstance;

    console.log(`User: ${user.id}, SocketId connected: ${socket.id}`);

    // Whenever we receive a 'message' we log it out
    socket.on("chat", function (data: any) {
      console.log(data);

      // socket.to(socket.id).emit()
      socket.emit("chat", data);
    });

    socket.on("disconnect", async () => {
      console.log(`User: ${user.id}, SocketId disconnected: ${socket.id}`);

      await helpers.socketIdCacheRemove(user.id, socket.id);
    });
  });
};
