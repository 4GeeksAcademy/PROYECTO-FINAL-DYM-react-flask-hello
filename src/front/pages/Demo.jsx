import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";



export const Demo = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");


  ///////////////


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
    <div className="container">
      <ul className="list-group">
        {/* Map over the 'todos' array from the store and render each item as a list element */}
        {store && store.todos?.map((item) => {
          return (
            <li
              key={item.id}  // React key for list items.
              className="list-group-item d-flex justify-content-between"
              style={{ background: item.background }}>

              {/* Link to the detail page of this todo. */}
              <Link to={"/single/" + item.id}>Nombre: {item.title} </Link>

              <p>Descripción</p>

              <button className="btn btn-success"
                onClick={() => dispatch({
                  type: "add_task",
                  payload: { id: item.id, color: '#ffa500' }
                })}>
                Lo tengo
              </button>
            </li>
          );
        })}
      </ul>
      <br />

      <Link to="/">
        <button className="btn btn-primary">Inicio</button>
      </Link>
    </div>
  );
};