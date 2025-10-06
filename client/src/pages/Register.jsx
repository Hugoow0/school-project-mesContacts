import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router";
import { register, isAuthenticated } from "../services/auth";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();

    if (isAuthenticated()) {
        return <Navigate to="/contacts" replace />;
    }

    async function handleSubmitRegisterForm(event) {
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
            await register({
                email: data.email,
                password: data.password,
            });
            alert("User successfully created");
            navigate("/auth/login");
        } catch (error) {
            alert(`Registration failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Register Page</h1>
            <div>
                <form onSubmit={handleSubmitRegisterForm}>
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
                        />{" "}
                    </div>

                    <button type="submit" disabled={loading}>
                        Register
                    </button>
                </form>
            </div>
            <br />
            <div>
                <span>
                    Or{" "}
                    <Link to="/auth/login" className="App-link">
                        Login
                    </Link>
                </span>
            </div>
        </div>
    );
}
