
export type IRoom = {
    _id?: string;
    name: string;
    players: number;
    maxPlayers: number;
    currentPlayers: number;
    url: string;
    isPrivate: boolean;
    description: string;
}

export type formDataRoom = {
    word: string;
    name: string;
    description: string;
    isPrivate: boolean;
    password: string;
    maxPlayers: number;
}