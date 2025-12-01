import React, { useEffect } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useNavigate } from "react-router-dom";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const loadMessage = async () => {
		try {

			const backendUrl = import.meta.env.VITE_BACKEND_URL

			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

			const response = await fetch(backendUrl + "/api/hello")
			const data = await response.json()

			if (response.ok) dispatch({ type: "set_hello", payload: data.message })

			return data
		} catch (error) {
			if (error.message) throw new Error
				(`Could not fetch the message from the backend.
				Please check if the backend is running and the backend port is public.`);
		}

	}

	useEffect(() => {
		loadMessage()
	}, [])

	return (



		<div
			className="cw-100 d-flex flex-column justify-content-center align-items-center pokedex-bg mx-auto "



			style={{
				minHeight: "100vh",
				background: "linear-gradient(135deg, #d42424ff, #3b4cca)",
				padding: "40px",
				color: "white",
				textAlign: "justify",
				/*backgroundSize: "50px"*/
			}}>



			{/* MasterB */}
			<img
				src="https://www.pngkey.com/png/full/30-309982_19-pokeball-picture-freeuse-stock-ball-pokemon-huge.png"
				alt="Poke Ball"
				className="mb-4"
				style={{ width: "120px" }}
			/>



			{/* Bienvenida */}
			<h1 className="fw-bold mb-3" style={{ fontSize: "3rem" }}>
				¡Bienvenido a tu Pokédex!
			</h1>



			{/* ¿Que es? */}
			<p className="fs-5 mb-4" style={{ maxWidth: "650px" }}>
				La <strong>Pokédex</strong> es una herramienta utilizada por los entrenadores Pokémon
				para consultar información sobre las diferentes especies que encuentran durante su viaje.
				Aquí podrás explorar Pokémon, crear tus listas personalizadas, guardar tus favoritos
				y mucho más.
			</p>



			{/* Imagen opcional 
			
			<img
				src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
				alt="Pikachu"
				className="mb-4"
				style={{ width: "100px" }}
			/>

			*/}



			{/* Botón inicio sesión y registro 
			<button
				onClick={() => navigate("/login")}
				className="btn btn-light btn-lg px-5 py-3 fw-bold shadow"
				style={{
					borderRadius: "50px",
					fontSize: "1.3rem"
				}}
			>
				Iniciar sesión / Registrarse
			</button>*/}

			{/* Footer */}

		</div>
	);
}; 