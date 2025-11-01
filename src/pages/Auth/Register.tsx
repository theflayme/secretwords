import { Button, Form, Input } from "antd"

const RegisterPage = () => {
    return (
        <main className="flex flex-col items-center justify-center h-[90vh]">
            <Form layout="vertical">
                <Form.Item label="Email" name="email">
                    <Input placeholder="Email" />
                </Form.Item>
                <Form.Item label="Password" name="password">
                    <Input placeholder="Password" />
                </Form.Item>
                <Form.Item label="Confirm Password" name="confirmPassword">
                    <Input placeholder="Confirm Password" />
                </Form.Item>
            </Form>
            <Button color="default" variant="filled" htmlType="submit" size="large">Регистрация</Button>
        </main>
    )
}

export default RegisterPage