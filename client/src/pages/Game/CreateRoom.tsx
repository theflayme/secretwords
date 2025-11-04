import { useState } from "react"
import { useNavigate } from "react-router-dom"

/* Types */
import type { formDataRoom } from "@/types/types.room"

/* UI */
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"

const CreateRoom = () => {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<formDataRoom>({
        word: "",
        name: "",
        description: "",
        isPrivate: false,
        password: "",
        maxPlayers: 4,
    })

    type handleInputChangeType = (field: keyof formDataRoom, value: string | number | boolean) => void

    const handleInputChange: handleInputChangeType = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))

        if (error) {
            setError("null")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const roomData = {
                ...formData,
                creator: "current_user",
                currentPlayers: 1,
                url: `room_${Date.now()}`
            }

            const response = await fetch("http://localhost:5000/room/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(roomData),
            })

            const result = await response.json()

            if (response.ok) {
                console.log("Room created:", result)
                navigate("/searchroom")
            } else {
                setError(result.message)
            }
        } catch (error) {
            console.error("Ошибка при создании комнаты:", error)
            setError("Ошибка при создании комнаты")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center py-10 h-[calc(100vh-105px)] gap-5">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl">Создать комнату</CardTitle>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircleIcon className="h-4 w-4 mr-2" />
                            <AlertTitle>{error}</AlertTitle>
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Загадать слово</Label>
                            <Input
                                id="word"
                                type="text"
                                placeholder="Введите слово"
                                value={formData.word}
                                onChange={(e) => handleInputChange("word", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Название комнаты</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Введите название комнаты"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Описание</Label>
                            <Input
                                id="description"
                                type="text"
                                placeholder="Опишите вашу комнату (необязательно)"
                                value={formData.description}
                                onChange={(e) => handleInputChange("description", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="maxPlayers">Максимальное количество игроков</Label>
                            <Input
                                id="maxPlayers"
                                type="number"
                                min="2"
                                max="10"
                                value={formData.maxPlayers}
                                onChange={(e) => handleInputChange("maxPlayers", parseInt(e.target.value))}
                                required
                            />
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="private">Приватная комната</Label>
                                <p className="text-sm text-muted-foreground">
                                    Требует пароль для входа
                                </p>
                            </div>
                            <Switch
                                id="private"
                                checked={formData.isPrivate}
                                onCheckedChange={(checked) => handleInputChange("isPrivate", checked)}
                            />
                        </div>

                        {formData.isPrivate && (
                            <div className="space-y-2">
                                <Label htmlFor="password">Пароль</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Введите пароль для комнаты"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                    required={formData.isPrivate}
                                />
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/searchroom")}
                                className="flex-1"
                            >
                                Отмена
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading || !formData.name.trim()}
                                className="flex-1"
                            >
                                {isLoading ? "Создание..." : "Создать комнату"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default CreateRoom;