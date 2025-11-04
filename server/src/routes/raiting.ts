import { Router, Request, Response } from "express";

const router = Router();
import User from "../models/User.js";
import { type IUser } from "../models/User.js";

router.get("/", async (req: Request, res: Response) => {
    try {
        // Получаем всех пользователей и сортируем по баллам в убывающем порядке
        const users = await User.find({}, { points: 1 , name: 1}).sort({ points: -1 });
        
        // Добавляем места в рейтинге
        const raitingList = users.map((user: IUser, index: number) => ({
            name: user.name,
            score: user.points || 0,
            place: index + 1
        }));
        
        res.json(raitingList);
    } catch (error) {
        res.status(500).json({ message: "Ошибка при получении рейтинга" });
    }
});

export default router;