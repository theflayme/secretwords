import { useEffect, useState } from "react";

const UsersPage = () => {
    const [email, setEmail] = useState<string>();
    
    useEffect(() => {
        const email  = localStorage.getItem("email");
        if (email) {
            setEmail(email);
        }
    }, []);

    return (
        <div>
            <h1>UsersPage</h1>
            <span>{email}</span>
        </div>
    )
}

export default UsersPage