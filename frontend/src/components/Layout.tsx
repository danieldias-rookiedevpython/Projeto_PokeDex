import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { menuItems } from "../config/menu";
import { logout } from "../services/authService";

export function Layout() {
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <>
            <header className="navbar">
                <nav>
                    <NavLink to="/" end>Home</NavLink>
                    {menuItems.map((item) => (
                        <NavLink key={item.to} to={item.to}>
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                <button onClick={handleLogout}>Sair</button>
            </header>
            <main className="page">
                <Outlet />
            </main>
        </>
    );
}