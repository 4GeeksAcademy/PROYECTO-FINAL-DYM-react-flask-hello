// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Navbar = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    const token = store.token || localStorage.getItem("token");
    const isLogged = Boolean(token);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedUser");
        dispatch({ type: "set_token", payload: null });
        navigate("/logout"); // vuelve a layout.jsx
    };




    const handleAddFavorite = (pokemon) => {
        // 1. Leer los favoritos actuales del localStorage
        const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

        // 2. Evitar duplicados
        if (!favorites.find(fav => fav.id === pokemon.id)) {
            const updatedFavorites = [...favorites, pokemon];

            // 3. Guardar la lista actualizada en localStorage
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

            // 4. Actualizar el estado global si quieres
            dispatch({ type: "set_favorites", payload: updatedFavorites });
        }

        // 5. Ir a la página de favoritos
        navigate("/favoritos");
    };


    return (
        <nav className="navbar navbar-expand-lg" style={{ background: "linear-gradient(90deg, #d42424, #3b4cca)", padding: "12px 20px", boxShadow: "0 4px 10px rgba(0,0,0,0.3)" }}>
            <div className="container-fluid">
                <Link to="/" className="navbar-brand fw-bold text-white" style={{ fontSize: "1.4rem" }}>Pokédex</Link>

                <div className="d-flex gap-3">
                    {!isLogged && (
                        <Link to="/login" className="btn btn-warning fw-bold">Iniciar sesión / Registrarse</Link>
                    )}

                    {isLogged && (
                        <>
                            <Link to="/pokedex" className="btn btn-light fw-bold">Mi Pokédex</Link>

                            {/* Botón de favoritos funcional
                            <button
                                className="btn btn-warning fw-bold"
                                onClick={() => handleAddFavorite({ id: 1, name: "Pikachu" })} // Aquí reemplaza con el Pokémon real dinámico
                            >
                                ⭐ Favoritos
                            </button>*/}


                            <button className="btn btn-danger fw-bold" onClick={handleLogout}>Cerrar sesión</button>

                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
