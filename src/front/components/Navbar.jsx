import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Navbar = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();

    const isLogged = !!store.token || !!localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch({ type: "set_token", payload: null });
        navigate("/");
    };

    return (
        <nav
            className="navbar navbar-expand-lg"
            style={{
                background: "linear-gradient(90deg, #d42424, #3b4cca)",
                padding: "12px 20px",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)"
            }}
        >
            <div className="container-fluid">






                {/* Logo / Inicio */}
                <Link to="/" className="navbar-brand fw-bold text-white" style={{ fontSize: "1.4rem" }}>
                    Pokédex
                </Link>

                {/* Botones a la derecha */}
                <div className="d-flex gap-3">

                    {/* Botón siempre visible: Inicio 
                    <Link to="/" className="btn btn-light fw-bold">
                        Inicio*
                    </Link>*/}

                    {/* Favoritooos 
                    <Link to="/favoritos">
                        <span className="btn btn-warning ms-2">⭐ Favoritos</span>
                    </Link>*/}


                    {/* Si el usuario NO está logueado */}
                    {!isLogged && (
                        <Link to="/login" className="btn btn-warning fw-bold">
                            Iniciar sesión / Registrarse
                        </Link>
                    )}

                    {/* Si el usuario SÍ está logueado */}
                    {isLogged && (
                        <>
                            <Link to="/pokedex" className="btn btn-light fw-bold">
                                Mi Pokédex
                            </Link>
{/* ------------------------------------------------------- */}
                            <Link to="/pokedex">
                                <button className="btn btn-danger">Pokédex</button>
                            </Link>


                            {/*<Link to="/demo" className="btn btn-light fw-bold">
                                Listas
                            </Link>*/}

                            <Link to="/logout">
                                <span className="btn btn-danger ms-2">Cerrar sesión</span>
                            </Link>

                        </>
                    )}
                </div>

            </div>
        </nav>
    );
};
