import { Button, Form, Input, message } from "antd"
import React, { useState } from "react"
import { type RegisterForm } from "../../types/Auth"
import { useNavigate } from "react-router-dom"

type Props = {
    onSwitchToLogin?: () => void
}

const SignUpPage: React.FC<Props> = ({ onSwitchToLogin }) => {
    const [error, setError] = useState<string | undefined>()
    const navigate = useNavigate()

    const onFinish = async (values: RegisterForm) => {
        try {
            const res = await fetch("http://localhost:5000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })
            
            if (!res.ok) {
                const data = await res.json()
                setError(data.message)
                return
            }
            
            message.success("Регистрация успешна")
            window.location.href = '/login';
        } catch (error) {
            console.error(error)
            setError("Ошибка регистрации")
        }
    }
    
    return (
        <div className="p-4">
            <Form layout="vertical" onFinish={onFinish}>
                {error && <div className="text-red-500">{error}</div>}
                <Form.Item
                    label="Почта"
                    name="email"
                    rules={[{ required: true, message: "Введите email", type: "email" }]}
                >
                    <Input placeholder="Введите email" size="large" />
                </Form.Item>

                <Form.Item
                    label="Пароль"
                    name="password"
                    rules={[{ required: true, message: "Введите пароль" }]}
                >
                    <Input.Password placeholder="Введите пароль" size="large" />
                </Form.Item>

                <Form.Item
                    label="Повторите пароль"
                    name="confirmPassword"
                    dependencies={["password"]}
                    rules={[
                        { required: true, message: "Повторите пароль" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve()
                                }
                                return Promise.reject(new Error("Пароли не совпадают"))
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="Введите пароль" size="large" />
                </Form.Item>

                <div className="flex flex-col gap-2">
                    <Button color="default" variant="filled" htmlType="submit" size="large" className="w-full">
                        Регистрация
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default SignUpPage