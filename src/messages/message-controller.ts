import { Request, Response } from "express";
import MessageModel from "./models/MessageModel";
import User from "../auth/models/User";

class MessageController {
    async list(req: Request, res: Response) {
        const { senderID, receiverID } = req.body;
        console.log("Received list request with body:", req.body); // Log request body
    
        try {
          const listMessage = await MessageModel.find({
            $or: [{ senderID }, { receiverID }],
          })
            .populate("senderID")
            .populate("receiverID");
    
          console.log("List Message Response:", listMessage); // Log response data
          if (listMessage.length === 0) {
            return res.status(200).json({ message: "No messages found" });
          }
          res.status(200).json(listMessage);
        } catch (error) {
          console.error("Error fetching list message:", error); // Log error
          res.status(400).json({ error: "Error fetching messages" });
        }
      }
  async create(data: any, io: any, socket: any, listSocketID: any) {
    const { senderID, receiverID, message } = data;
    const newMessage = new MessageModel({ senderID, receiverID, message });

    try {
      await newMessage.save();

      const [messagesFromSender, messagesFromReceiver, receiver] =
        await Promise.all([
          MessageModel.find({ senderID, receiverID })
            .populate("senderID")
            .populate("receiverID"),
          MessageModel.find({ senderID: receiverID, receiverID: senderID })
            .populate("senderID")
            .populate("receiverID"),
          User.findById(receiverID),
        ]);

      const messages = [...messagesFromSender, ...messagesFromReceiver];

      if (receiver?.socketID && listSocketID.includes(receiver.socketID)) {
        io.to(receiver.socketID).emit("message", messages);
      }

      socket.emit("message", messages);

      const listMessage = await MessageModel.find({
        $or: [{ senderID: senderID }, { receiverID: senderID }],
      })
        .populate("senderID")
        .populate("receiverID");

      socket.emit("listMessage", listMessage);
    } catch (error) {
      // res.status(400).json(error);
    }
  }

  async find(data: any, io: any, socket: any, listSocketID: any) {
    const { senderID, receiverID } = data;

    try {
      const [messageSender, messageReceiver, user] = await Promise.all([
        MessageModel.find({ senderID, receiverID })
          .populate("senderID")
          .populate("receiverID"),
        MessageModel.find({ senderID: receiverID, receiverID: senderID })
          .populate("senderID")
          .populate("receiverID"),
        User.findById(receiverID),
      ]);

      const messages = [...messageSender, ...messageReceiver];

      if (user?.socketID && listSocketID.includes(user.socketID)) {
        io.to(user.socketID).emit("message", messages);
      }

      socket.emit("message", messages);
      const listMessage = await MessageModel.find({
        $or: [{ senderID: senderID }, { receiverID: senderID }],
      })
        .populate("senderID")
        .populate("receiverID");
      socket.emit("listMessage", listMessage);
    } catch (error) {
      // res.status(400).json(error);
    }
  }
}

export default new MessageController();
