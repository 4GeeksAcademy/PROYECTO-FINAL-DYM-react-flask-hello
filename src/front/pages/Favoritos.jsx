import React, { useEffect, useState } from "react";


const getFavorites = () => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
};

const saveFavorites = (favorites) => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
};

const removeFavorite = (id) => {
    const favs = getFavorites().filter(f => f.id !== id);
    saveFavorites(favs);
    return favs;
};

export const Favoritos = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    const handleRemove = (id) => {
        const updated = removeFavorite(id);
        setFavorites(updated);
    };


    
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
