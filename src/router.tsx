import { createBrowserRouter } from 'react-router-dom'
import HomePage from './pages/Home'
import LoginPage from './pages/Auth/Login'
import RegisterPage from './pages/Auth/Register'
const Router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />
    },
    {
        path: 'login',
        element: <LoginPage />
    },
    {
        path: 'register',
        element: <RegisterPage />
    }
])

export default Router