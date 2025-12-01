import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Pokedex = () => {
    const navigate = useNavigate();

    // Pokémon list
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedPokemon, setSelectedPokemon] = useState(null);

    // Fetch first generation Pokémon
    const loadFirstGen = async () => {
        try {
            const resp = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
            const data = await resp.json();

            setPokemonList(data.results);
            setLoading(false);
        } catch (error) {
            setError("Error al cargar los Pokémon.");
            setLoading(false);
        }
    };

    const loadPokemonData = async (url) => {
        try {
            const resp = await fetch(url);
            const data = await resp.json();
            setSelectedPokemon(data);
        } catch (error) {
            setError("No se pudo cargar el Pokémon.");
        }
    };

    useEffect(() => {
        // PROTECT ROUTE
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        loadFirstGen();
    }, []);

    if (loading) return <h2 className="text-center mt-5">Cargando Pokédex...</h2>;

    return (
        <div className="container py-4">

            <h1 className="text-center fw-bold mb-4">Pokédex – Primera Generación</h1>

            {error && <p className="text-danger text-center">{error}</p>}

            <div className="row">

                {/* LISTA DE 151 POKÉMON */}
                <div className="col-md-4">
                    <ul className="list-group">
                        {pokemonList.map((poke, index) => (
                            <li
                                key={index}
                                className="list-group-item d-flex justify-content-between align-items-center"
                                style={{ cursor: "pointer" }}
                                onClick={() => loadPokemonData(poke.url)}
                            >
                                {index + 1}. {poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}

                                <span className="badge bg-primary rounded-pill">Ver</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* DETALLE DEL POKÉMON */}
                <div className="col-md-8">
                    {selectedPokemon ? (
                        <div className="card p-4 shadow">
                            <h2 className="text-center fw-bold">
                                {selectedPokemon.name.toUpperCase()}
                            </h2>

                            <div className="text-center">
                                <img
                                    src={selectedPokemon.sprites.front_default}
                                    alt={selectedPokemon.name}
                                    style={{ width: "150px" }}
                                />
                            </div>

                            <h4 className="mt-3">Características:</h4>
                            <ul>
                                <li><strong>ID:</strong> {selectedPokemon.id}</li>
                                <li><strong>Altura:</strong> {selectedPokemon.height}</li>
                                <li><strong>Peso:</strong> {selectedPokemon.weight}</li>
                                <li>
                                    <strong>Tipos:</strong>
                                    {" "}
                                    {selectedPokemon.types.map((t) => t.type.name).join(", ")}
                                </li>
                            </ul>
                        </div>
                    ) : (
                        <p className="text-center mt-5">Selecciona un Pokémon de la lista.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
