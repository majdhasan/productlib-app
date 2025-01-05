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

    const response = await fetch("http://localhost:8080/api/users/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
    });

    if (!response.ok) {
        throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    setToken(data.token);
    return data.token;
};