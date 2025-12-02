import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
      
        localStorage.removeItem("token");
        localStorage.removeItem("favorites");  
    }, []);

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #ff4d4d, #3b4cca)",
                padding: "20px",
                color: "white",
                textAlign: "center"
            }}
        >
            <div
                className="card shadow p-4"
                style={{
                    width: "420px",
                    borderRadius: "18px",
                    background: "white",
                    color: "#333"
                }}
            >
                <h2 className="fw-bold mb-3">¡Hasta pronto, entrenadorx!</h2>

                <img
                    src="src/front/pages/pngegg.png"
                    alt="Pokeball Bye"
                    style={{ size: "250px" }}
                />

                <p className="fs-5 mb-3">
                    Tu sesión ha sido cerrada exitosamente.
                    <br />
                    ¡Esperamos verte de nuevo muy pronto para seguir atrapándolos a todos!
                </p>

                <Link to="/login">
                    <button className="btn btn-primary w-100 fw-bold" style={{ borderRadius: "12px" }}>
                        Iniciar sesión nuevamente
                    </button>
                </Link>

                <p className="mt-3">
                    O vuelve al <Link to="/" className="fw-bold text-primary">Inicio</Link>.
                </p>
            </div>
        </div>
    );
};
