import { createBrowserRouter } from "react-router-dom"
import HomePage from "../pages/Home"

const Router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
    },
])

export default Router