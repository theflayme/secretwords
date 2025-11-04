import { Button } from "@/components/ui/button"
import { LogOutIcon, UserIcon } from "lucide-react"

const Setting = ({ handleLogout, handleLogin, authToken }: { handleLogout: () => void, handleLogin: () => void, authToken: boolean }) => {
    return (
        <div className="flex flex-row gap-2">
            {authToken ? (
                <Button variant="ghost" size="icon" onClick={handleLogout}><LogOutIcon className="size-6 opacity-50" /></Button>
            ) : (
                <Button variant="ghost" size="icon" onClick={handleLogin}><UserIcon className="size-6 opacity-50" /></Button>
            )}
        </div>
    )
}

export default Setting