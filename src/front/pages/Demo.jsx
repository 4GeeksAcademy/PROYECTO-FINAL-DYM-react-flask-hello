import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";



export const Demo = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  // Protege la ruta
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchFavorites();
    }
  }, []);

  // Obtener favoritos del backend
  const fetchFavorites = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${backendUrl}/api/favorites`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setFavorites(data.favorites || []);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar de favoritos
  const removeFromFavorites = async (favoriteId) => {
    try {
      const response = await fetch(`${backendUrl}/api/favorites/${favoriteId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Actualizar la lista localmente
        setFavorites(favorites.filter(fav => fav.id !== favoriteId));
        alert("Eliminado de favoritos");
      } else {
        const data = await response.json();
        alert(data.message || "Error al eliminar");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión");
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Mis Listas y Favoritos</h1>
        <Link to="/pokedex">
          <button className="btn btn-primary">
            📖 Volver a la Pokédex
          </button>
        </Link>
      </div>

      {loading ? (
        <p className="text-center">Cargando favoritos...</p>
      ) : favorites.length === 0 ? (
        <div className="text-center mt-5">
          <h3>No tienes favoritos aún</h3>
          <p className="text-muted">Ve a la Pokédex y añade algunos Pokémon</p>
          <Link to="/pokedex">
            <button className="btn btn-success mt-3">
              Ir a la Pokédex
            </button>
          </Link>
        </div>
      ) : (
        <div className="row">
          {favorites.map((fav) => (
            <div className="col-6 col-md-3 mb-4" key={fav.id}>
              <div className="card text-center p-3 h-100">
                <img
                  src={fav.pokemon_sprite}
                  alt={fav.pokemon_name}
                  style={{ width: "96px", margin: "0 auto" }}
                />
                <h5 className="mt-2 text-capitalize">{fav.pokemon_name}</h5>
                <p className="text-muted">#{fav.pokemon_id}</p>

                {/* Botón eliminar */}
                <button
                  className="btn btn-danger btn-sm mt-2"
                  onClick={() => removeFromFavorites(fav.id)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};