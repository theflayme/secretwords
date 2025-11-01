import { Button, Form, Input } from "antd"
import { useNavigate } from "react-router-dom"
import type { LoginForm } from "../../types/Auth"

const LoginPage = () => {
    const navigate = useNavigate()
    
    const onFinish = (values: LoginForm) => {
        console.log(values)
    }

    return (
        <div>
            <main className="flex flex-col items-center justify-center h-[90vh]">
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Email" name="email">
                        <Input placeholder="Email" />
                    </Form.Item>
                    <Form.Item label="Password" name="password">
                        <Input placeholder="Password" />
                    </Form.Item>
                    <div className="flex justify-between gap-4">  
                        <Button color="default" variant="filled" htmlType="submit" size="large">Авторизация</Button>
                        <Button color="default" variant="text" htmlType="button" size="large" onClick={() =>navigate('/register')}>Регистрация</Button>
                    </div>
                </Form>
            </main>
        </div>  
    )
}

export default LoginPage