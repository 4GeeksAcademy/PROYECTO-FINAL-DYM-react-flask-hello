import React, { useState, useEffect } from "react";

const getFavorites = () => JSON.parse(localStorage.getItem("favorites")) || [];
const saveFavorites = (favorites) => localStorage.setItem("favorites", JSON.stringify(favorites));

export const PokemonCard = ({ pokemon }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const favs = getFavorites();
        setIsFavorite(favs.some(f => f.id === pokemon.id));
    }, [pokemon.id]);

    const handleToggleFavorite = () => {
        let updatedFavorites = getFavorites();
        if (isFavorite) {
            updatedFavorites = updatedFavorites.filter(f => f.id !== pokemon.id);
        } else {
            updatedFavorites.push(pokemon);
        }
        saveFavorites(updatedFavorites);
        setIsFavorite(!isFavorite);
    };

    return (
        <div className="card text-center p-3 mb-3">
            <img src={pokemon.sprite || pokemon.image} alt={pokemon.name} className="img-fluid" />
            <h5 className="mt-2 text-capitalize">{pokemon.name}</h5>
            <p>#{pokemon.id}</p>
            <button
                className={`btn w-100 fw-bold ${isFavorite ? "btn-danger" : "btn-warning"}`}
                onClick={handleToggleFavorite}
            >
                {isFavorite ? "💔 Quitar de favoritos" : "⭐ Añadir a favoritos"}
            </button>
        </div>
    );
};
