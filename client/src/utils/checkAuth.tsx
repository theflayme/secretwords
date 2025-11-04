const checkAuth = async () => {
    try {
        const res = await fetch("http://localhost:5000/auth/check", {
            method: "GET",
            credentials: "include",
        });
        return res.ok;
    } catch {
        return false;
    }
};
export default checkAuth;