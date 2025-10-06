import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router";
import { AUTH_TOKEN_KEY } from "../middlewares/middleware";
import { isAuthenticated } from "../middlewares/middleware";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();

    if (isAuthenticated()) {
        return <Navigate to="/contacts" replace />;
    }

    async function handleSubmitLoginForm(event) {
        setLoading(true);
        event.preventDefault();
        const formData = new FormData(event.target);

        const data = Object.fromEntries(formData);
        console.log("All form data:", data);
        if (
            !String(data.email).trim().length ||
            !String(data.password).trim().length
        ) {
            alert("Required fields must contains valid values");
            setLoading(false);
            return;
        }
        //TODO: replace url by .env variable
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: data.email,
                        password: data.password,
                    }),
                }
            );

            const result = await response.json();
            console.log("Response:", result);

            if (response.ok) {
                localStorage.setItem(AUTH_TOKEN_KEY, result.token);
                setLoading(false);
                navigate("/contacts");
            } else {
                throw new Error(result.error || "Login failed");
            }
        } catch (error) {
            console.error(error);
            alert(error);
        }
        setLoading(false);
        return;
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
