import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const Pokedex = () => {
    const navigate = useNavigate();
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const perPage = 20;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem("token");

    // Protege la ruta
    useEffect(() => {
        if (!token) {
            navigate("/login");
        }
    }, []);

    // Llamada a PokeAPI
    useEffect(() => {
        const fetchPokemons = async () => {
            try {
                setLoading(true);

                const resp = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
                const data = await resp.json();

                // Traer imágenes
                const enriched = data.results.map((poke, index) => ({
                    id: index + 1,
                    name: poke.name,
                    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`
                }));

                setPokemonList(enriched);
            } catch (err) {
                console.log("Error cargando Pokémon:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemons();
    }, []);

    // Añadir a favoritos
    const addToFavorites = async (pokemon) => {
        if (!token) {
            alert("Debes iniciar sesión");
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/favorites`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    pokemon_id: pokemon.id,
                    pokemon_name: pokemon.name,
                    pokemon_sprite: pokemon.sprite
                })
            });

            const data = await response.json();

            if (response.ok) {
                alert(`¡${pokemon.name} añadido a favoritos!`);
            } else {
                alert(data.message || "Error al añadir a favoritos");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión");
        }
    };

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pagePokemons = pokemonList.slice(start, end);

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Pokédex de Kanto</h1>
                <Link to="/Demo">
                    <button className="btn btn-warning">
                        ⭐ Ver mis Listas y Favoritos
                    </button>
                </Link>
            </div>

            {loading ? (
                <p className="text-center">Cargando...</p>
            ) : (
                <div className="row">
                    {pagePokemons.map((poke) => (
                        <div className="col-6 col-md-3 mb-4" key={poke.id}>
                            <div className="card text-center p-3 h-100">
                                <img src={poke.sprite} alt={poke.name} />
                                <h5 className="mt-2 text-capitalize">{poke.name}</h5>
                                <p className="text-muted">#{poke.id}</p>

                                {/* Botón añadir a favoritos */}
                                <button
                                    className="btn btn-success btn-sm mt-2"
                                    onClick={() => addToFavorites(poke)}
                                >
                                    ❤️ Añadir a favoritos
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Controles de paginación */}
            <div className="d-flex justify-content-center mt-4">
                <button
                    className="btn btn-secondary mx-2"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Anterior
                </button>

                <button
                    className="btn btn-primary mx-2"
                    disabled={end >= pokemonList.length}
                    onClick={() => setPage(page + 1)}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
};