import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from "bcrypt";

export interface IUser extends Document {
  email: string;
  username?: string;
  password: string;
  fullname: string;
  avatar: string;
  refreshToken: string;
  socketID: string;
  isOnline: boolean;
  isTyping: boolean;

}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String},
  password: { type: String, required: true },
  fullname: { type: String },
  avatar: { type: String },
  refreshToken: { type: String },
  socketID: { type: String },
  isOnline: { type: Boolean, default: false },
  isTyping: { type: Boolean, default: false },
},
{
  timestamps: true,
});

UserSchema.methods.encryptPassword = function (password: string) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
};

UserSchema.methods.validPassword = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};


export default mongoose.model<IUser>('User', UserSchema);

