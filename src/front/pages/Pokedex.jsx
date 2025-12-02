import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const getFavorites = () => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
};

const saveFavorites = (favorites) => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
};

const toggleFavorite = (pokemon) => {
    const favs = getFavorites();
    const exists = favs.find((fav) => fav.id === pokemon.id);
    let updated;

    if (exists) {
        updated = favs.filter((fav) => fav.id !== pokemon.id);
    } else {
        updated = [...favs, pokemon];
    }

    saveFavorites(updated);
    return updated;
};

export const Pokedex = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [favorites, setFavorites] = useState([]);

    // Obtener pokemons
    useEffect(() => {
        const fetchPokemons = async () => {
            const resp = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
            const data = await resp.json();
            const detailed = await Promise.all(
                data.results.map(async (p) => {
                    const info = await fetch(p.url).then((r) => r.json());
                    return { id: info.id, name: info.name, sprite: info.sprites.front_default };
                })
            );
            setPokemonList(detailed);
        };

        fetchPokemons();
        setFavorites(getFavorites());
    }, []);

    const handleFavorite = (poke) => {
        const updated = toggleFavorite(poke);
        setFavorites(updated);
    };

    const isFavorite = (id) => {
        return favorites.some((f) => f.id === id);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Pokédex de Kanto</h1>
            <div className="text-center mb-4">
                <Link to="/favoritos">
                    <button className="btn btn-warning fw-bold">⭐ Ver mis favoritos</button>
                </Link>
            </div>
            <div className="row">
                {pokemonList.map((poke) => (
                    <div key={poke.id} className="col-6 col-md-3 col-lg-2 mb-4">
                        <div className="card text-center p-2">
                            <img src={poke.sprite} alt={poke.name} />
                            <h5 className="mt-2">{poke.name}</h5>
                            <p>#{poke.id}</p>
                            <button
                                className={`btn w-100 fw-bold ${isFavorite(poke.id) ? "btn-danger" : "btn-success"}`}
                                onClick={() => handleFavorite(poke)}
                            >
                                {isFavorite(poke.id) ? "💔 Quitar de favoritos" : "💚 Añadir a favoritos"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};










