import { createBrowserRouter } from 'react-router-dom'

import HomePage from '../pages/HomePage'
import UsersPage from '../pages/UsersPage'
import LogInPage from '../pages/Auth/LogInPage'
import SignUpPage from '../pages/Auth/SignUpPage'
import GamePage from '../pages/GamePage'

const router = createBrowserRouter([
    {
        path: '/',
        element: <HomePage />,
        children: [
            {
                path: 'users',
                element: <UsersPage />,
            },
            {
                path: 'login',
                element: <LogInPage />
            },
            {
                path: 'signup',
                element: <SignUpPage />
            },
            {
                path: 'game',
                element: <GamePage />
            }
        ]
    }
])

export default router