import { Schema, model } from "mongoose";

interface IMessage {
  senderID: {
    type: Schema.Types.ObjectId;
    ref: "User1";
  };
  receiverID: {
    type: Schema.Types.ObjectId;
    ref: "User1";
  };
  message: string;
}

const messageSchema = new Schema<IMessage>(
  {
    senderID: {
      type: Schema.Types.ObjectId,
      ref: "User1",
    },
    receiverID: {
      type: Schema.Types.ObjectId,
      ref: "User1",
    },
    message: { type: String },
  },
  {
    timestamps: true,
  }
);

const MessageModel = model<IMessage>("Message", messageSchema);

export default MessageModel;
