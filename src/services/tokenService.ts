import { baseUrl } from "./apiService";

export const getToken = () => {
    return localStorage.getItem("token");
};

export const setToken = (token: string) => {
    localStorage.setItem("token", token);
};

export const refreshToken = async () => {
    const token = getToken();
    if (!token) {
        throw new Error("No token found");
    }

    const response = await fetch(`${baseUrl}/users/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
    });

    if (!response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("cartId");
        throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    setToken(data.token);
    return data.token;
};