import User from "../models/User.js";
import { IRoom } from "../models/models.room.js";

export const validateRegister = async (email: string, password: string, uid: string, points: number) => {
  if (!email || !password) {
    return { error: "Введите email и пароль" };
  }
  if (!email.includes("@")) {
    return { error: "Введите корректный email" };
  }
  if (password.length < 6) {
    return { error: "Пароль должен содержать минимум 6 символов" };
  }
  const existingUser = await User.findOne({ email: email, uid: uid, points: points });
  if (existingUser) {
    return { error: "Пользователь с таким email уже существует" };
  }
  return { error: null };
};

export const validateCreateRoom = async (room: IRoom) => {
  if (!room.name || !room.word || !room.maxPlayers) {
    return { error: "Неверные данные комнаты" };
  }
  if (room.maxPlayers < 2 || room.maxPlayers > 10) {
    return { error: "Максимальное количество игроков должно быть от 2 до 10" };
  }
  if (room.word.length < 3 || room.word.length > 20) {
    return { error: "Слово должно содержать от 3 до 20 символов" };
  }
  if (room.name.length < 3 || room.name.length > 20) {
    return { error: "Название комнаты должно содержать от 3 до 20 символов" };
  };
};