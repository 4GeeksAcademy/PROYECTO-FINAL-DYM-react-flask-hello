const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? "";

function authHeaders(token) {
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    };
}

async function authedRequest(path, token, options = {}) {
    const response = await fetch(`${BASE_URL}${path}`, {
        method: options.method ?? "GET",
        headers: {
            ...authHeaders(token),
            ...(options.headers ?? {}),
        },
        body: options.body ?? null,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data?.message ?? "Error inesperado en favoritos";
        throw new Error(message);
    }

    return data;
}

export const favoritesService = {
    list(token) {
        return authedRequest("/favorites/", token);
    },
    add(token, { pokemonId, nickname }) {
        return authedRequest("/favorites/", token, {
            method: "POST",
            body: JSON.stringify({
                pokemon_id: pokemonId,
                nickname,
            }),
        });
    },
    update(token, favoriteId, payload) {
        return authedRequest(`/favorites/${favoriteId}`, token, {
            method: "PATCH",
            body: JSON.stringify(payload),
        });
    },
    remove(token, favoriteId) {
        return authedRequest(`/favorites/${favoriteId}`, token, {
            method: "DELETE",
        });
    },
};