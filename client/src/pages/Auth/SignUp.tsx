
import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* Types */
import { type SignUpData } from "@/types/types.auth";

/* UI */
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";


const SignUp = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [signUpData, setSignUpData] = useState<SignUpData>({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

  const handleSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    setError("");
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Пароли не совпадают");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signUpData.name,
          email: signUpData.email,
          password: signUpData.password,
        }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        navigate("/login");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Ошибка при регистрации: " + error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-105px)]">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="name">Имя</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  value={signUpData.name}
                  onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Пароль</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirmPassword">Повторите пароль</FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={signUpData.confirmPassword}
                  onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                  required
                />
              </Field>
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
              <Button type="submit" disabled={isLoading} className="w-full mt-4">
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </FieldGroup>
          </FieldSet>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Уже есть аккаунт?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Войти
          </a>
        </p>
      </div>
    </div>
  )
}

export default SignUp;