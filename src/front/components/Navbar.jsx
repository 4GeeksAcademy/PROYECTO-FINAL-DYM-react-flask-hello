import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Navbar = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useGlobalReducer();


    const token = store.token || localStorage.getItem("token");
    const isLogged = !!token;


    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch({ type: "set_token", payload: null });
        navigate("/"); // ← Te envía a Home/Layout
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

                {/* Logo */}
                <Link to="/" className="navbar-brand fw-bold text-white" style={{ fontSize: "1.4rem" }}>
                    Pokédex
                </Link>

                {/* BOTONES DERECHA */}
                <div className="d-flex gap-3">



                 
                    {!isLogged && (
                        <Link to="/login" className="btn btn-warning fw-bold">
                            Iniciar sesión / Registrarse
                        </Link>
                    )}

                  
                    {isLogged && (
                        <>
                            <Link to="/pokedex" className="btn btn-light fw-bold">
                                Mi Pokédex
                            </Link>



                            <button className="btn btn-danger fw-bold" onClick={handleLogout}>
                                Cerrar sesión
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
