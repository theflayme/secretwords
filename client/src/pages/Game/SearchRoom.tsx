import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

/* UI */
import { Button } from "@/components/ui/button";
import { Loader2, PlusIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { Item, ItemActions, ItemContent } from "@/components/ui/item";

/* Utils */
import checkAuth from "@/utils/checkAuth";

/* UI */
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

/* Types */
import type { IRoom } from "@/types/types.room";

const SearchRoom = () => {
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [rooms, setRooms] = useState<React.ReactNode[]>([]);
    const [roomsLoading, setRoomsLoading] = useState<boolean>(false);
    const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(false);
    const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);
    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [isPasswordChecking, setIsPasswordChecking] = useState<boolean>(false);

    const handleJoinRoom = (room: IRoom) => {
        if (room.isPrivate) {
            setSelectedRoom(room);
            setPasswordDialogOpen(true);
            setPasswordError("");
            setPassword("");
        } else {
            navigate(`/game?room=${room.url}`);
        }
    };

    const handlePasswordSubmit = async () => {
        if (!selectedRoom || !password || !selectedRoom._id) {
            setPasswordError("Пожалуйста, введите пароль");
            return;
        }

        setIsPasswordChecking(true);
        setPasswordError("");
        
        try {
            const response = await fetch(`http://localhost:5000/game/room/${selectedRoom._id}/verify-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });

            if (response.ok) {
                navigate(`/game?room=${selectedRoom.url}&password=${password}`);
                setPasswordDialogOpen(false);
                setPassword("");
                setSelectedRoom(null);
            } else {
                const errorData = await response.json();
                setPasswordError(errorData.message);
            }
        } catch (error) {
            setPasswordError("Ошибка при проверке пароля");
        } finally {
            setIsPasswordChecking(false);
        }
    };

    const getRoomsListItems = async (): Promise<React.ReactNode[]> => {
        try {
            const response = await fetch("http://localhost:5000/room/");
            
            if (!response.ok) {
                console.error(`Failed to fetch rooms: ${response.status} ${response.statusText}`);
                return [];
            }
            
            const data = await response.json();
            return data.map((room: IRoom, index: number) => (
                <Item key={room._id || index} variant="outline" className="room-item flex flex-row my-2 justify-between items-center h-auto bg-sidebar dark:bg-sidebar rounded-md p-4 border border-sidebar-border">
                    <ItemContent>
                        <div className="flex flex-col">
                            <span className="text-sidebar-foreground font-medium">{room.name}</span>
                            <span className="text-sidebar-foreground/70 text-sm">{room.description}</span>
                            <span className="text-sidebar-foreground/70 text-sm">{room.currentPlayers}/{room.maxPlayers}</span>
                        </div>
                    </ItemContent>
                    <ItemActions>
                        <Button variant="outline" onClick={() => handleJoinRoom(room)}>
                            {room.isPrivate ? "🔒 Вступить" : "Вступить"}
                        </Button>
                    </ItemActions>
                </Item>
            ));
        } catch (error) {
            console.error("Error fetching rooms:", error);
            return [];
        }
    }

    useEffect(() => {
        checkAuth().then((res) => {
            setIsAuthenticated(res);
            setIsLoading(false);
            if (!res) {
                navigate("/login");
            }   
        });
    }, [navigate]);

    useEffect(() => {
        if (isAuthenticated) {
            setRoomsLoading(true);
            getRoomsListItems().then((roomItems) => {
                setRooms(roomItems);
                setRoomsLoading(false);
            });
        }
    }, [isAuthenticated]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-[calc(100vh-105px)]">
            <Loader2 className="size-6 opacity-75 animate-spin" />
        </div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return (
        <div className="flex flex-col items-center py-10 h-[calc(100vh-105px)] gap-5">
            <div className="add-room flex flex-row justify-start items-center w-full">
                <Button variant="default" onClick={() => navigate("/createroom")}><PlusIcon className="size-4 opacity-75" />Создать комнату</Button>
            </div>
            {/* <div className="search-room flex flex-row gap-2 w-full max-w-2xl mx-auto">
                <Input placeholder="Search Room" />
                <Button variant="outline">Search</Button>
            </div> */}
            <ScrollArea className="rooms-list flex flex-col w-full max-w-2xl mx-auto h-[calc(100vh-300px)]">
                {roomsLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <Loader2 className="size-6 opacity-75 animate-spin" />
                    </div>
                ) : rooms.length > 0 ? (
                    rooms
                ) : (
                    <div className="flex justify-center items-center h-32 text-sidebar-foreground/70">
                        Комнаты не найдены
                    </div>
                )}
            </ScrollArea>

            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Введите пароль для комнаты "{selectedRoom?.name}"</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        <Input
                            type="password"
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !isPasswordChecking && password && handlePasswordSubmit()}
                        />
                        {passwordError && (
                            <div className="text-destructive text-sm">
                                {passwordError}
                            </div>
                        )}
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
                                Отмена
                            </Button>
                            <Button onClick={handlePasswordSubmit} disabled={!password || isPasswordChecking}>
                                {isPasswordChecking ? (
                                    <>
                                        <Loader2 className="size-4 mr-2 animate-spin" />
                                        Проверка...
                                    </>
                                ) : (
                                    "Вступить"
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default SearchRoom;