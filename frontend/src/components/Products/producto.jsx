import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext.jsx"; // Asegúrate que la ruta sea correcta
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Importa SweetAlert

const Producto = ({ categoriaId }) => {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);
  const { agregarAlCarrito } = useContext(CartContext); // Obtiene la función del contexto
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        console.log("Cargando productos para categoriaId:", categoriaId); // Log para verificar el id
        const response = await axios.get(
          `http://localhost:4000/productos/categoria/${categoriaId}`
        );
        console.log("Productos recibidos:", response.data); // Log para depuración
        setProductos(response.data); // Asigna los productos al estado
      } catch (err) {
        console.error("Error al obtener productos:", err);
        setError("Error al obtener productos");
      }
    };

    fetchProductos();
  }, [categoriaId]);

  const handleAddToCart = async (producto) => {
    if (producto.cantidad_stock > 0) {
      // Agregar al carrito
      agregarAlCarrito({ ...producto, cantidad: 1 });
  
      // Enviar solicitud al servidor para actualizar el stock
      try {
        await axios.put(`http://localhost:4000/producto/${producto.id}`, {
          cantidad_stock: producto.cantidad_stock - 1,
        });
  
        // Actualizar el stock en el frontend después de la actualización en el backend
        const updatedProductos = productos.map((prod) =>
          prod.id === producto.id
            ? { ...prod, cantidad_stock: prod.cantidad_stock - 1 }
            : prod
        );
        setProductos(updatedProductos);
  
        Swal.fire({
          icon: "success",
          title: "Producto Agregado",
          text: `${producto.nombre} ha sido agregado al carrito.`,
          confirmButtonText: "OK",
          background: "#f8f9fa", 
          color: "#333", 
          timer: 1000,
        });
      } catch (err) {
        console.error("Error al actualizar el stock:", err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo actualizar el stock del producto.",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Sin Stock",
        text: "Este producto ya no tiene stock disponible.",
      });
    }
  };
  
  return (
    <div>
      {error && <p>{error}</p>} {/* Muestra error si lo hay */}
      <div id="lista-productos">
        {productos.length > 0 ? (
          productos.map((producto) =>
            producto.cantidad_stock > 0 ? ( // Solo renderiza si hay stock
              <div
                key={producto.id}
                className="item-producto border rounded-lg shadow-lg overflow-hidden"
              >
                {/* Imagen del producto */}
                <div
                  className="imagen-placeholder h-48 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(http://localhost:4000/${producto.imagen})`,
                  }}
                >
                  {!producto.imagen ? "+" : ""}
                </div>
                {/* Información del producto */}
                <div className="p-4">
                  <h2 className="font-bold text-xl">
                    {producto.nombre || "Nombre no disponible"}
                  </h2>
                  <p className="text-gray-600">
                    <strong>Stock:</strong> {producto.cantidad_stock}
                  </p>
                  <p className="text-gray-800 font-semibold">
                    <strong>Precio: $</strong>
                    {producto.precio}
                  </p>
                  <button onClick={() => handleAddToCart(producto)}>
                    Agregar al Carrito
                  </button>
                </div>
              </div>
            ) : null
          )
        ) : (
          <p>No hay productos disponibles.</p> // Mensaje si no hay productos
        )}
      </div>
    </div>
  );
};

export default Producto;
