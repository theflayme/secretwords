import { NextFunction, Request, Response, Router } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { validateRegister } from "../utils/validation.js";
import User from "../models/User.js";
import { randomUUID } from "crypto";
import { RegisterBody, LoginBody } from "../models/models.auth.js";

const router = Router();
const JWT_SECRET = "uUmoXEuXBQySaqPAVzzlX5QWJreQalq5ueOC43oD9oy4azBkrIO8VK5R32BMXdwhL4alOXsRPpYdp4llqh0yURHQ7Ktaib7haBjOaBJFDKEZgUbhIDjYDWkVsYimCUsMWm3tDl1htZW71wRALDcqtH43hdnLTw4LDhHAJS3bOwUjREOYaoubaJqGlI6NHZYyBmJnV7lgHIW7JxQRrP1UcTSILPx0nTGqXBdkvBAJZbypSg5PuKRVLwYpnWEB7M36";


export function verifyToken(req: Request, res: Response, next: NextFunction) {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies?.authToken) {
    token = req.cookies.authToken;
  }

  if (!token) {
    return res.status(401).json({ message: "Нет токена авторизации" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
    // @ts-ignore
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Неверный или просроченный токен" });
  }
}
// Регистрация
router.post("/register", async (req, res) => {
  const user: RegisterBody = req.body;

  const validationError = await validateRegister(user.email, user.password, randomUUID(), 0);
  if (validationError.error) {
    return res.status(400).json({ message: validationError.error });
  }

  try {
    const hashedPassword = await bcryptjs.hash(user.password, 10);

    const newUser = new User({
      name: user.name,
      email: user.email,
      password: hashedPassword,
      points: 0,
      uid: randomUUID(),
    });

    await newUser.save();

    // Не отправляем пароль назад!
    res.status(200).json({ user: { email: newUser.email, id: newUser._id } });
  } catch (error) {
    res.status(500).json({ message: "Ошибка регистрации" });
  }
});

// Вход (логин)
router.post("/login", async (req, res) => {
  const user: LoginBody = req.body;

  // Валидация данных
  if (!user.email || !user.password) {
    return res.status(400).json({ message: "Введите email и пароль" });
  }

  try {
    // Ищем пользователя
    const foundUser = await User.findOne({ email: user.email });
    if (!foundUser) {
      return res.status(400).json({ message: "Пользователь не найден" });
    }

    // Проверяем пароль
    const isMatch = await bcryptjs.compare(user.password, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Неверный пароль" });
    }

    // Генерируем JWT
    const token = jwt.sign(
      {
        id: foundUser._id,
        email: foundUser.email,
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600000,
    });

    res.status(200).json({ message: "Вход успешен" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при входе" });
  }
});

router.post("/logout", async (req, res) => {
  res.clearCookie("authToken");
  res.status(200).json({ message: "Выход успешен" });
});

// Изменено с POST на GET для поддержки проверки через GET /auth/check
router.get("/check", async (req, res) => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ message: "Нет токена авторизации" });
    }
    res.status(200).json({ message: "Токен авторизации есть" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при проверке токена" });
  }
});

export default router;