type LoginForm = {
    email: string
    password: string
}

type RegisterForm = {
    email: string
    password: string
    confirmPassword: string
}

export type { LoginForm, RegisterForm }