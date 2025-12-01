import React, { useEffect, useState } from "react";


//nuevas funciones para guardar favs
const API_URL = "https://script.google.com/macros/s/AKfycbz56biKdbO-Gdbzy7Y2BJ3GAVZiqG1ZVUv-uOS3Gx3AGqPCHVXELJ6EUo9mT4vQOaxM/exec"

// Generar o recuperar un userID único para el user
const getUserId = () => {
    let userID = localStorage.getItem("userId");
    if (!userID) {
        userID = "user_" + Math.random().toString(36).substring(2, 9);
        localStorage.setItem("userId", userID);
    }
    return userID;
};

// Get favoritos desde WEB APP
const getFavorites = async () => {
    try {
        const userId = getUserId();
        const response = await fetch(`${API_URL}?action=get&userId=${userId}`);
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error("Error al obtener favoritos:", error);
        return [];
    }
};

// DELETE fav de la WE APP
const removeFavorite = async (id) => {
    try {
        const userID = getUserId();
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "remove", userID, id })
        });

        return await getFavorites();
    } catch (error) {
        console.error("Error al eliminar favorito:", error);
        return await getFavorites();
    }
};

export const Favoritos = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            const favs = await getFavorites();
            setFavorites(favs);
            setLoading + (false);
        };
        fetchFavorites();
    }, []);

    const handleRemove = async (id) => {
        const updated = removeFavorite(id);
        setFavorites(updated);
    };


    if (loading) {
        return <div className="container mt-4 text-center">
            Cargando favoritos...
        </div>
    }

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">❤️ Tus Pokémon Favoritos</h1>

            {favorites.length === 0 ? (
                <p className="text-center fs-4">No tienes favoritos todavía.</p>
            ) : (
                <div className="row">
                    {favorites.map(poke => (
                        <div key={poke.id} className="col-6 col-md-3 col-lg-2 mb-4">
                            <div className="card text-center p-3">
                                <img src={poke.sprite} alt={poke.name} />

                                <h5 className="mt-2 text-capitalize">{poke.name}</h5>
                                <p>#{poke.id}</p>

                                <button
                                    className="btn btn-danger w-100 fw-bold"
                                    onClick={() => handleRemove(poke.id)}
                                >
                                    💔 Quitar de favoritos
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};