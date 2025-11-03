import { Button, Form, Input, message, Modal } from "antd"
import { useNavigate } from "react-router-dom"
import type { LoginForm } from "../../types/Auth"
import { useState } from "react"
import SignUpPage from "./SignUpPage"

const LogInPage: React.FC = () => {
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = (target: boolean) => {
        setIsModalOpen(target);
    };
    
    const onFinish = async (values: LoginForm) => {
        const res = await fetch("http://localhost:5000/auth/login", {
            credentials:"include",
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })

        const data = await res.json();

        if (!res.ok) {
            message.error(data.message);
            return;
        }

        window.location.href = '/users';
    }

    return (
        <>
        <div className="w-full max-w-md flex align-center justify-center">
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Введите email" }]}
                >
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Введите пароль" }]}
                >
                    <Input.Password placeholder="Password" />
                </Form.Item>
                <div className="flex flex-col justify-between gap-2">  
                    <Button color="default" variant="filled" htmlType="submit" size="large" className="w-full">
                        Авторизация
                    </Button>
                    <Button color="default" variant="text" htmlType="button" size="large" onClick={() => toggleModal(true)}>
                        Регистрация
                    </Button>
                </div>
            </Form>
        </div>
        <Modal
            open={isModalOpen}
            onOk={() => toggleModal(false)}
            onCancel={() => toggleModal(false)}
            footer={null}
            width={300}
            height={800}
        >
            <SignUpPage />
        </Modal>
        </>
    )
}

export default LogInPage