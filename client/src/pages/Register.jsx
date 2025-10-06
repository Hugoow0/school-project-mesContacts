import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router";
import { isAuthenticated } from "../middlewares/middleware";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    let navigate = useNavigate();

    if (isAuthenticated()) {
        return <Navigate to="/contacts" replace />;
    }

    async function handleSubmitRegisterForm(event) {
        setLoading(true);
        event.preventDefault();
        const formData = new FormData(event.target);

        const data = Object.fromEntries(formData);
        //console.log("All form data:", data);
        if (
            !String(data.username).trim().length ||
            !String(data.password).trim().length
        ) {
            alert("Required fields must contains valid values");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/register`,
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
            //console.log("Response:", result);

            if (response.ok) {
                alert("User successfully created");
                setLoading(false);
                navigate("/auth/login");
            } else {
                throw new Error(result.error || "Registration failed");
            }
        } catch (error) {
            //console.error(error);
            alert(error);
        }
        setLoading(false);
        return;
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
