import { createBrowserRouter } from "react-router-dom";
import Home from "@/pages/Home";
import LogIn from "@/pages/Auth/LogIn";
import Header from "@/components/layout/Header";
import Game from "@/pages/Game/Game";
import SearchRoom from "@/pages/Game/SearchRoom";
import Raiting from "@/pages/Raiting";
import SignUp from "@/pages/Auth/SignUp";
import CreateRoom from "@/pages/Game/CreateRoom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Header />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "/login",
                element: <LogIn />
            },
            {
                path: "/game",
                element: <Game />
            },
            {
                path: "/searchroom",
                element: <SearchRoom />
            },
            {
                path: "/raiting",
                element: <Raiting />
            },
            {
                path: "/signup",
                element: <SignUp />
            },
            {
                path: "/createroom",
                element: <CreateRoom />
            }
            // {
            //     path: "/profile",
            //     element: <Profile />
            // }
        ]
    },
]);

export default router;