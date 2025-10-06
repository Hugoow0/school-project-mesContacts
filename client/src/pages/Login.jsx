import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router";
import { login, isAuthenticated } from "../services/auth";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();

    if (isAuthenticated()) {
        return <Navigate to="/contacts" replace />;
    }

    async function handleSubmitLoginForm(event) {
        event.preventDefault();
        setLoading(true);

        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);

        if (
            !String(data.email).trim().length ||
            !String(data.password).trim().length
        ) {
            alert("Required fields must contain valid values");
            setLoading(false);
            return;
        }

        try {
            await login({
                email: data.email,
                password: data.password,
            });
            navigate("/contacts");
        } catch (error) {
            alert(`Login failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Login Page</h1>
            <div>
                <form onSubmit={handleSubmitLoginForm}>
                    <div>
                        <label>Email: </label>
                        <input
                            name="email"
                            title="email"
                            type="email"
                            required
                            disabled={loading}
                        />
                        <label>Password: </label>
                        <input
                            name="password"
                            title="password"
                            type="password"
                            required
                            disabled={loading}
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        Login
                    </button>
                </form>
            </div>
            <br />
            <div>
                <span>
                    Or{" "}
                    <Link to="/auth/register" className="App-link">
                        Register
                    </Link>
                </span>
            </div>
        </div>
    );
}
