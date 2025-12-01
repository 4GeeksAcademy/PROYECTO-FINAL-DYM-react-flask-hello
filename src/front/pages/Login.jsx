import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";


export const Login = () => {
    const navigate = useNavigate();
    const { dispatch } = useGlobalReducer();

    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        displayName: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            if (!backendUrl) {
                throw new Error("VITE_BACKEND_URL no está configurada.");
            }



            // --- REGISTRO ---
            if (!isLogin) {
                if (form.password !== form.confirmPassword) {
                    setError("Las contraseñas no coinciden.");
                    return;
                }

                const resp = await fetch(`${backendUrl}/api/auth/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: form.email,
                        password: form.password,
                        display_name: form.displayName
                    })
                });

                const data = await resp.json();
                if (!resp.ok) {
                    setError(data.message || "Ocurrió un error al registrarse.");
                    return;
                }

                // Registro correcto → iniciar sesión automáticamente
                const loginResp = await fetch(`${backendUrl}/api/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: form.email,
                        password: form.password
                    })
                });

                const loginData = await loginResp.json();

                if (!loginResp.ok) {
                    setError("Registro exitoso, pero fallo el inicio de sesión.");
                    return;
                }

                // Guardar token
                localStorage.setItem("token", loginData.access_token);
                dispatch({ type: "set_token", payload: loginData.access_token });

                // Redirigir a Pokedex
                navigate("/pokedex");
                return;
            }



            // --- LOGIN ---
            const resp = await fetch(`${backendUrl}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: form.email,
                    password: form.password
                })
            });

            const data = await resp.json();

            if (!resp.ok) {
                setError(data.message || "Credenciales incorrectas.");
                return;
            }



            // Guardar/redirigir
            localStorage.setItem("token", data.access_token);
            dispatch({ type: "set_token", payload: data.access_token });

            navigate("/pokedex");

        } catch (err) {
            setError("Error de conexión con el servidor.");
        }
    };

    return (
        <div
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #d42424ff, #3b4cca)",
                padding: "20px"
            }}
        >
            <div
                className="card shadow p-4"
                style={{
                    width: "420px",
                    borderRadius: "18px",
                    background: "white"
                }}
            >


                {/* Logo */}
                <div className="text-center mb-3">
                    <img
                        src="https://www.pngkey.com/png/full/30-309982_19-pokeball-picture-freeuse-stock-ball-pokemon-huge.png"
                        alt="Master Ball"
                        style={{ width: "80px" }}
                    />
                </div>



                {/* Titulo */}
                <h2 className="text-center fw-bold mb-3">
                    {isLogin ? "Iniciar Sesión" : "Crear una Cuenta"}
                </h2>



                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="mb-3">
                            <label className="form-label fw-bold">Nombre de entrenadorx</label>
                            <input
                                type="text"
                                name="displayName"
                                className="form-control"
                                placeholder="Ash Ketchum"
                                value={form.displayName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label fw-bold">Correo electrónico</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="tu@correo.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="********"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>



                    {/* Confirma contraseña sooolo para registro*/}
                    {!isLogin && (
                        <div className="mb-3">
                            <label className="form-label fw-bold">Confirmar contraseña</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control"
                                placeholder="********"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}



                    {/* Mensajes */}
                    {error && <p className="text-danger text-center fw-bold">{error}</p>}
                    {success && <p className="text-success text-center fw-bold">{success}</p>}

                    <button
                        type="submit"
                        className="btn btn-primary w-100 fw-bold mt-3"
                        style={{ borderRadius: "12px" }}
                    >
                        {isLogin ? "Ingresar" : "Registrarse"}
                    </button>
                </form>



                {/* Cambiar login<->registro */}
                <p className="text-center mt-3">
                    {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                    <span
                        className="text-primary fw-bold"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError("");
                            setSuccess("");
                        }}
                    >
                        {isLogin ? "Regístrate aquí" : "Inicia sesión aquí"}
                    </span>
                </p>



                {/* RESET PASSWORD ??? *
                <p className="text-center mt-2">
                    <span
                        className="text-secondary"
                        style={{ cursor: "pointer", textDecoration: "underline" }}
                        onClick={() => navigate("/reset-password")}
                    >
                        ¿Olvidaste tu contraseña?
                    </span>
                </p>/*/}



            </div>
        </div>
    );
};
