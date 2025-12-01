import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";


export const Favoritos = () => {

    const [favorites, setFavorites] = useState([]);

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKENR_URL;

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/");
            return
        }

        fetchFavorites();

    }, []);

    const fetchFavorites = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/favorites`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setFavorites(data.favorites || []);
            } else {
                console.error("Error al cargar favoritos");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (favoriteId) => {
        try {
            const response = await fetch(`${backendUrl}/api/favorites/${favoriteId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                setFavorites(favorites.filter(fav => fav.id !== favoriteId));
                alert("Eliminado de favoritos");
            } else {
                alert("Error al eliminar");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión");
        }
    };


    if (loading) {
        return (
            <div className="container mt-4">
                <h2 className="text-center">Cargando favoritos...
                </h2>
            </div>
        );
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
}
