// JWT Authentication utilities
export const AUTH_TOKEN_KEY = "superMegaSecretSessionToken";

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return false;

    try {
        // Basic JWT validation (check if token is expired)
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Date.now() / 1000;
        return payload.exp > currentTime;
    } catch (error) {
        //console.error("Invalid token format:", error);
        return false;
    }
};

// Get the JWT token
export const getAuthToken = () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
};

// Remove token (logout)
export const removeAuthToken = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
};

// Authenticated fetch wrapper for API calls
export const authenticatedFetch = async (url, options = {}) => {
    const token = getAuthToken();

    if (!token || !isAuthenticated()) {
        throw new Error("No valid authentication token");
    }

    const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    // If token is invalid/expired, remove it
    if (response.status === 401) {
        removeAuthToken();
        window.location.href = "/auth/login";
    }

    return response;
};
