import { Router, Request, Response } from "express";
import { LobbyDB, type ILobby, type Lobby, LobbySchema } from "../models/models.room.js";
import { validateCreateRoom } from "../utils/validation.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    try {
        const rooms = await LobbyDB.find().lean();
        const roomsData: ILobby[] = rooms.map((room: Lobby) => ({
            name: room.name,
            description: room.description,
            isPrivate: room.isPrivate,
            maxPlayers: room.maxPlayers,
            currentPlayers: room.currentPlayers,
            url: room.url
        }));
        return res.status(200).json(roomsData);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка при получении комнат", error });
    }
});
router.post("/create", async (req: Request, res: Response) => {
    try {
        const validationError = await validateCreateRoom(req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError.error });
        }

        const newRoom = new LobbyDB(req.body);
        const savedRoom = await newRoom.save();
        return res.status(200).json({ message: "Комната успешно создана", room: savedRoom });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка при создании комнаты", error });
    }
});

export default router;