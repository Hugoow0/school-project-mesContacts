const AUTH_TOKEN_KEY = "authToken";

export const isAuthenticated = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp > currentTime;
    } catch (error) {
        return false;
    }
};

export const login = async (credentials) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    const data = await response.json();
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    return data;
};

export const register = async (userData) => {
    const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
    }

    return response.json();
};

export const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    window.location.href = "/auth/login";
};

export const getAuthToken = () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
};
