import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModeToggle } from "@/components/ModeToggle"
import Setting from "@/components/layout/Setting"
import { Button } from "../ui/button"
import { MedalIcon, GamepadDirectional } from "lucide-react"
import { useEffect, useState } from "react"
import checkAuth from "@/utils/checkAuth"

const Header = () => {
    const nav = useNavigate();
    const location = useLocation();
    const [authToken, setAuthToken] = useState<boolean>(false);

    useEffect(() => {
        // Initial check on mount
        checkAuth().then((res) => setAuthToken(res));
        // Handler to recheck auth status when auth:changed event is fired
        const onAuthChanged = () => {
            checkAuth().then((res) => setAuthToken(res));
        };
        window.addEventListener("auth:changed", onAuthChanged);
        return () => window.removeEventListener("auth:changed", onAuthChanged);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("http://localhost:5000/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } finally {
            window.dispatchEvent(new Event("auth:changed"));
            nav("/");
        }
    };

    const handleLogin = () => {
        nav("/login");
    };

    return (
        <>
            <header className="flex justify-between items-center gap-2">
            { authToken ? (
                <div className="left-side flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback></AvatarFallback>
                    </Avatar>
                    <div className="rating flex flex-col items-start">
                        <p className="text-sm text-muted-foreground">Ваш рейтинг:</p>
                        <span className="text-md font-bold">1 место</span>
                    </div>
                </div>
            ) : (
                <div className="left-side flex items-center gap-2">
                    <p className="text-xl font-bold text-black/50 dark:text-white/50">Secert Words</p>
                </div>
            )}

                <div className="right-side flex items-center gap-2">
                    {authToken ? (
                        <Button variant="outline" onClick={() => nav("/searchroom")}><GamepadDirectional className="size-4 opacity-50" />Комнаты</Button>
                    ) : (<></>)}
                    <Button variant="ghost" size="icon" onClick={() => nav("/raiting")}><MedalIcon className="size-6 opacity-50" /></Button>
                    <ModeToggle />
                    <Setting handleLogout={handleLogout} handleLogin={handleLogin} authToken={authToken} />
                </div>
            </header>
            <Outlet />
        </>
    )
}

export default Header