import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Pokedex = () => {
    const navigate = useNavigate();
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const perPage = 20;

    // Protege la ruta
    useEffect(() => {
        const token = localStorage.getItem("token");
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

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const pagePokemons = pokemonList.slice(start, end);

    return (
        <div className="container py-5">
            <h1 className="text-center mb-4">Pokédex de Kanto</h1>

            {loading ? (
                <p className="text-center">Cargando...</p>
            ) : (
                <div className="row">
                    {pagePokemons.map((poke) => (
                        <div className="col-6 col-md-3 mb-4" key={poke.id}>
                            <div className="card text-center p-3">
                                <img src={poke.sprite} alt={poke.name} />
                                <h5 className="mt-2 text-capitalize">{poke.name}</h5>
                                <p className="text-muted">#{poke.id}</p>
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
