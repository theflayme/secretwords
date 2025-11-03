import { Router } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import { UserModel, validateRegister, type User } from "../utils/validation.js";

const router = Router();
const JWT_SECRET = 'secret';

router.post("/register", async (req, res) => {
  try {
    const user: User = req.body;

    // Валидация данных
    const validationError = await validateRegister(user.email, user.password);
    if (validationError.error) {
        return res.status(400).json({ message: validationError.error });
    }

    // Хеширование пароля
    const hashedPassword = await bcryptjs.hash(user.password, 10);

    // Создание нового пользователя
    const newUser = new UserModel({
      email: user.email,
      password: hashedPassword,
    });

    await newUser.save();

    // Отправка ответа
    res.json({
      message: "Регистрация успешна",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.post("/login", async (req, res) => {
    
    const user: User = req.body;
  
      if (!user.email || !user.password)
        return res.status(400).json({ message: "Введите email и пароль" });
  
      // Ищем пользователя
      const foundUser = await UserModel.findOne({ email: user.email });
      if (!foundUser) return res.status(400).json({ message: "Пользователь не найден" });
  
      // Проверяем пароль
      const isMatch = await bcryptjs.compare(user.password, foundUser.password);
      if (!isMatch) return res.status(400).json({ message: "Неверный пароль" });
  
      // Генерируем JWT
      const token = jwt.sign(
        { id: foundUser._id, email: foundUser.email },
        JWT_SECRET,
        { expiresIn: "1h" }
      );


    res.cookie("authToken", token, { httpOnly: true, secure: true, maxAge: 3600000});
    res.status(200).json({ message: "Вход успешен" });
  });


export default router;
