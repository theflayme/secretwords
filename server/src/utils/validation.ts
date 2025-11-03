import { Schema, model } from "mongoose";

export type User = {
  email: string;
  password: string;
};

const userSchema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const UserModel = model<User>("User", userSchema);

export const validateRegister = async (email: string, password: string) => {
  if (!email || !password) {
    return { error: "Введите email и пароль" };
  }

  if (!email.includes("@")) {
    return { error: "Введите корректный email" };
  }

  if (password.length < 6) {
    return { error: "Пароль должен содержать минимум 6 символов" };
  }

  // Проверяем, есть ли пользователь с таким email
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return { error: "Пользователь с таким email уже существует" };
  }

  return { error: null };
};
