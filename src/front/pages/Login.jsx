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
                        password: form.password
                    })
                });

                const data = await resp.json();
                if (!resp.ok) {
                    setError(data.msg || "Ocurrió un error al registrarse.");
                    return;
                }

                setSuccess("Registro exitoso. ¡Ya puedes iniciar sesión!");
                setIsLogin(true);
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
                setError(data.msg || "Credenciales incorrectas.");
                return;
            }

            // Guardar token y redirigir
            localStorage.setItem("token", data.token);
            dispatch({ type: "set_token", payload: data.token });

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
                background: "linear-gradient(135deg, #3b4cca, #ffcb05)",
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
                {/* LOGO */}
                <div className="text-center mb-3">
                    <img
                        src="https://www.pngkey.com/png/full/30-309982_19-pokeball-picture-freeuse-stock-ball-pokemon-huge.png"
                        alt="Master Ball"
                        style={{ width: "80px" }}
                    />
                </div>

                {/* TÍTULO */}
                <h2 className="text-center fw-bold mb-3">
                    {isLogin ? "Iniciar Sesión" : "Crear una Cuenta"}
                </h2>

                {/* FORM */}
                <form onSubmit={handleSubmit}>

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

                    {/* CONFIRM PASSWORD SOLO PARA REGISTRO */}
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

                    {/* MENSAJES */}
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

                {/* CAMBIAR ENTRE LOGIN Y REGISTRO */}
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

                {/* RESET PASSWORD *
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
