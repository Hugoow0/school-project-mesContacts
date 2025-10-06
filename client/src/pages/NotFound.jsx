import { NavLink } from "react-router";
export default function NotFound() {
    return (
        <div>
            <h1>Page Not Found</h1>
            <div>
                <NavLink to="/" end>
                    Home
                </NavLink>
                {" | "}
                <NavLink to="/auth/login" end>
                    Login
                </NavLink>
                {" | "}
                <NavLink to="/auth/register" end>
                    Register
                </NavLink>
            </div>
        </div>
    );
}
