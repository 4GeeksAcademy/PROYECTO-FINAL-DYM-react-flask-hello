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
        displayName: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Registro local
        if (!isLogin) {
            if (form.password !== form.confirmPassword) {
                setError("Las contraseñas no coinciden.");
                return;
            }
            const exists = users.find(u => u.email === form.email);
            if (exists) {
                setError("Ya existe una cuenta con ese correo.");
                return;
            }
            const newUser = {
                email: form.email,
                password: form.password,
                displayName: form.displayName,
                favorites: []
            };
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));
            setSuccess("Registro exitoso. ¡Ya puedes iniciar sesión!");
            setIsLogin(true);
            return;
        }

        // Login local
        const user = users.find(u => u.email === form.email && u.password === form.password);
        if (!user) {
            setError("Credenciales incorrectas.");
            return;
        }

        // Guardar usuario logueado
        localStorage.setItem("loggedUser", JSON.stringify(user));

  
        const token = "LOCAL_TOKEN"; 
        localStorage.setItem("token", token);
        dispatch({ type: "set_token", payload: token });

        // Redirigir a pokedex
        navigate("/pokedex");
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh", background: "linear-gradient(135deg, #d42424ff, #3b4cca)", padding: "20px" }}>
            <div className="card shadow p-4" style={{ width: "420px", borderRadius: "18px", background: "white" }}>
                <div className="text-center mb-3">
                    <img src="https://www.pngkey.com/png/full/30-309982_19-pokeball-picture-freeuse-stock-ball-pokemon-huge.png" alt="Master Ball" style={{ width: "80px" }} />
                </div>

                <h2 className="text-center fw-bold mb-3">{isLogin ? "Iniciar Sesión" : "Crear una Cuenta"}</h2>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="mb-3">
                            <label className="form-label fw-bold">Nombre de entrenadorx</label>
                            <input type="text" name="displayName" className="form-control" placeholder="Ash Ketchum" value={form.displayName} onChange={handleChange} required />
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label fw-bold">Correo electrónico</label>
                        <input type="email" name="email" className="form-control" placeholder="tu@correo.com" value={form.email} onChange={handleChange} required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label fw-bold">Contraseña</label>
                        <input type="password" name="password" className="form-control" placeholder="********" value={form.password} onChange={handleChange} required />
                    </div>

                    {!isLogin && (
                        <div className="mb-3">
                            <label className="form-label fw-bold">Confirmar contraseña</label>
                            <input type="password" name="confirmPassword" className="form-control" placeholder="********" value={form.confirmPassword} onChange={handleChange} required />
                        </div>
                    )}

                    {error && <p className="text-danger text-center fw-bold">{error}</p>}
                    {success && <p className="text-success text-center fw-bold">{success}</p>}

                    <button type="submit" className="btn btn-primary w-100 fw-bold mt-3" style={{ borderRadius: "12px" }}>
                        {isLogin ? "Ingresar" : "Registrarse"}
                    </button>
                </form>

                <p className="text-center mt-3">
                    {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
                    <span className="text-primary fw-bold" style={{ cursor: "pointer" }} onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }}>
                        {isLogin ? "Regístrate aquí" : "Inicia sesión aquí"}
                    </span>
                </p>
            </div>
        </div>
    );
};
