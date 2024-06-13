import { Server } from "socket.io";
import http from "http";
import User from "./auth/models/User";
import messageController from "./messages/message-controller";
import { Socket } from "socket.io";
import { URL_LOCALHOST, URL_PRODUCTION } from "./utils/types";

const listSocketID: any = [];

const handleLogin = async (socket: Socket, userId: string) => {
  listSocketID.push(socket.id);
  await User.findOneAndUpdate({ _id: userId }, { socketID: socket.id });
  socket.emit("login_success", { userId, socketId: socket.id });
};

const handleLogout = async (socket: Socket, userId: string) => {
  const index = listSocketID.indexOf(socket.id);
  if (index !== -1) {
    listSocketID.splice(index, 1);
  }
  await User.findOneAndUpdate({ _id: userId }, { socketID: "" });
  socket.emit("logout_success", { userId, socketId: socket.id });
};

const handleMessage = async (socket: Socket, io: any, data: any) => {
  await messageController.create(data, io, socket, listSocketID);
};

const handleGetMessage = async (socket: Socket, io: any, data: any) => {
  await messageController.find(data, io, socket, listSocketID);
};

export const handleSocket = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: [URL_LOCALHOST, URL_PRODUCTION],
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    socket.on("login", async (userId: string) => {
      await handleLogin(socket, userId);
    });

    socket.on("logout", async (userId: string) => {
      await handleLogout(socket, userId);
    });

    socket.on("message", async (data: any) => {
      await handleMessage(socket, io, data);
    });

    socket.on("get-message", async (data: any) => {
      await handleGetMessage(socket, io, data);
    });

    socket.on("disconnect", async () => {
      // Clear the cached socket ID for the disconnected socket
      const index = listSocketID.indexOf(socket.id);
      if (index !== -1) {
        listSocketID.splice(index, 1);
      }
  
      // Update the user's socketID to an empty string
      const user = await User.findOne({ socketID: socket.id });
      if (user) {
        await User.findByIdAndUpdate(user._id, { socketID: "" });
      }
  
      // Optionally, broadcast the updated user list to inform other clients
      // This step depends on your application's requirements
      const updatedUsers = await User.find();
      io.emit("userListUpdate", updatedUsers);
    });
  });

  

  return io;
};