import mongoose, { Schema } from "mongoose";
import { z } from "zod";

// Схема для создания комнаты
export const LobbySchema = z.object({
    word: z.string().min(3).max(20),
    name: z.string(),
    description: z.string(),
    isPrivate: z.boolean(),
    password: z.string().optional(),
    creator: z.string(),
    maxPlayers: z.number(),
    currentPlayers: z.number(),
    url: z.string(),
});

export type Lobby = z.infer<typeof LobbySchema>;

// Схема для получения информации о комнате для списка комнат
export const ILobbySchema = z.object({
    name: z.string(),
    description: z.string(),
    isPrivate: z.boolean(),
    maxPlayers: z.number(),
    currentPlayers: z.number(),
    url: z.string(),
});

export type ILobby = z.infer<typeof ILobbySchema>;

// Схема для получения информации о комнате для игрока
export const IRoomSchema = z.object({
    word: z.string(),
    name: z.string(),
    maxPlayers: z.number(),
    currentPlayers: z.number(),
    url: z.string(),
});

export type IRoom = z.infer<typeof IRoomSchema>;


// Схема для создания комнаты в базе данных
export const LobbyDBSchema = new Schema<Lobby>({
    word: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    isPrivate: { type: Boolean, required: true },
    password: { type: String, required: false },
    creator: { type: String, required: true },
    maxPlayers: { type: Number, required: true },
    currentPlayers: { type: Number, required: true },
    url: { type: String, required: true },
});

    // Модель для создания комнаты в базе данных
export const LobbyDB = mongoose.model<Lobby>("Lobby", LobbyDBSchema);
