import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  points: number;
  uid: string;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  points: { type: Number, default: 0 },
  uid: { type: String, required: true, unique: true },
});

// безопасно при повторных импортах / хот-релоадах
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
export default User;