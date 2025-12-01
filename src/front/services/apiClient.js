const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "";

async function request(path, options = {}) {
    const response = await fetch(`${BASE_URL}${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers ?? {}),
        },
        ...options,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data?.message ?? "Error inesperado en la API";
        throw new Error(message);
    }

    return data;
}

export default {
    register: (payload) =>
        request("/auth/register", {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    login: (payload) =>
        request("/auth/login", {
            method: "POST",
            body: JSON.stringify(payload),
        }),
    me: (token) =>
        request("/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
        }),
};