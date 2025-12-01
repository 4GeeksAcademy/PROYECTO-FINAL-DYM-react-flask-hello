import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//funciones para la WEB APP
const API_URL = "https://script.google.com/macros/s/AKfycbz56biKdbO-Gdbzy7Y2BJ3GAVZiqG1ZVUv-uOS3Gx3AGqPCHVXELJ6EUo9mT4vQOaxM/exec"


const getUserId = () => {
    let userID = localStorage.getItem("userId");
    if (!userID) {
        userID = "user_" + Math.random().toString(36).substring(2, 9);
        localStorage.setItem("userId", userID);
    }
    return userID;
};

// ---- Funciones para LocalStorage ----
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


const toggleFavorite = async (pokemon) => {
    try {
        const userID = getUserId();
        await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "toggle", userID, pokemon })
        });
        return await getFavorites();
    } catch (error) {
        console.error("Error al alternar favoritos:", error);
        return await getFavorites();
    }
};

export const Pokedex = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);


    // Pokemones
    useEffect(() => {
        const fetchPokemons = async () => {
            const resp = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
            const data = await resp.json();

            const detailed = await Promise.all(
                data.results.map(async (p, index) => {
                    const info = await fetch(p.url).then(r => r.json());
                    return {
                        id: info.id,
                        name: info.name,
                        sprite: info.sprites.front_default
                    };
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
        return favorites.some(f => f.id === id);
    };

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Pokédex de Kanto</h1>
            <div className="text-center mb-4">
                <Link to="/favoritos">
                    <button className="btn btn-warning fw-bold">
                        ⭐ Ver mis favoritos
                    </button>
                </Link>
            </div>


            <div className="row">
                {pokemonList.map(poke => (
                    <div key={poke.id} className="col-6 col-md-3 col-lg-2 mb-4">

                        <div className="card text-center p-2">
                            <img src={poke.sprite} alt={poke.name} />

                            <h5 className="mt-2">{poke.name}</h5>
                            <p>#{poke.id}</p>

                            <button
                                className={`btn w-100 fw-bold ${isFavorite(poke.id)
                                    ? "btn-danger"
                                    : "btn-success"
                                    }`}
                                onClick={() => handleFavorite(poke)}
                            >
                                {isFavorite(poke.id)
                                    ? "💔 Quitar de favoritos"
                                    : "💚 Añadir a favoritos"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
