import { Router, Request, Response } from "express";
import { LobbyDB } from "../models/models.room.js";

const router = Router();

router.get("/room", async (req: Request, res: Response) => {
    try {
        const room = await LobbyDB.findOne({ url: req.query.room }).lean();
        return res.status(200).json(room);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка при получении комнаты", error });
    }
});

router.post("/room/:id/verify-password", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { password } = req.body;

        const room = await LobbyDB.findById(id);
        
        if (!room) {
            return res.status(404).json({ message: "Комната не найдена" });
        }

        if (!room.isPrivate) {
            return res.status(400).json({ message: "Комната не является приватной" });
        }

        if (room.password !== password) {
            return res.status(401).json({ message: "Неверный пароль" });
        }

        return res.status(200).json({ message: "Пароль верный" });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка при проверке пароля", error });
    }
});


export default router;