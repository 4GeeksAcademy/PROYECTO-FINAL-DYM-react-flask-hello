/*import React from "react";*/
import { useNavigate } from "react-router-dom";
/*import "bootstrap/dist/css/bootstrap.min.css";*/

const Welcome = () => {
    const navigate = useNavigate();

    return (
        <div 
            className="container d-flex flex-column justify-content-center align-items-center"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #ffcb05, #3b4cca)",
                padding: "40px",
                color: "white",
                textAlign: "center"
            }}
        >
            {/* Logo / Imagen */}
            <img 
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                alt="Poke Ball"
                className="mb-4"
                style={{ width: "120px" }}
            />

            {/* Título */}
            <h1 className="fw-bold mb-3" style={{ fontSize: "3rem" }}>
                ¡Bienvenido a tu Pokédex!
            </h1>

            {/* Descripción */}
            <p className="fs-5 mb-4" style={{ maxWidth: "650px" }}>
                La <strong>Pokédex</strong> es una herramienta utilizada por los entrenadores Pokémon 
                para consultar información sobre las diferentes especies que encuentran durante su viaje.  
                Aquí podrás explorar Pokémon, crear tus listas personalizadas, guardar tus favoritos
                y mucho más.
            </p>

            {/* Imagen opcional de Pokémon */}
            <img
                src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
                alt="Pikachu"
                className="mb-4"
                style={{ width: "100px" }}
            />

            {/* Botón */}
            <button
                onClick={() => navigate("/login")}
                className="btn btn-light btn-lg px-5 py-3 fw-bold shadow"
                style={{
                    borderRadius: "50px",
                    fontSize: "1.3rem"
                }}
            >
                Iniciar Sesión / Registrarse
            </button>

            {/* Footer */}
            <p classname="mt-4 opacity-75" style={{ fontSize: "0.9rem" }}>
                Proyecto Pokédex • React + Flask • PokéAPI
            </p>
        </div>
    );
};

export default Welcome;
