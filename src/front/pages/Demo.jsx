import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";



export const Demo = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");





  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      fetchFavorites();
    }
  }, []);




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





  const removeFromFavorites = async (favoriteId) => {
    try {
      const response = await fetch(`${backendUrl}/api/favorites/${favoriteId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {

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

        {store && store.todos?.map((item) => {
          return (
            <li
              key={item.id}  
              className="list-group-item d-flex justify-content-between"
              style={{ background: item.background }}>


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