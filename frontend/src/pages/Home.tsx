import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

export function Home() {
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <main>
            <h1>Home</h1>
            <button onClick={handleLogout}>Sair</button>
        </main>
    );
}