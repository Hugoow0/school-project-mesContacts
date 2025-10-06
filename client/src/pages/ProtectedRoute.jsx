import { Navigate, Link } from "react-router";
import { isAuthenticated, removeAuthToken } from "../middlewares/middleware";
import { useNavigate } from "react-router";

export default function ProtectedRoute({ children }) {
    const navigate = useNavigate();

    if (!isAuthenticated()) {
        return <Navigate to="/auth/login" replace />;
    }

    const handleLogout = () => {
        removeAuthToken();
        navigate("/auth/login");
    };

    return (
        <>
            <Link to="/contacts" className="App-link">
                Mes contacts
            </Link>
            {" | "}
            <button onClick={handleLogout}>Logout</button>
            <hr />
            {children}
        </>
    );
}
