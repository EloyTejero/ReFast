import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2"; // Importa SweetAlert

const Cart = () => {
  const [mensaje, setMensaje] = useState("");
  const { cart, setCart } = useContext(CartContext);
  const { user, getUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  // Función para aumentar la cantidad de un producto
 // Función para aumentar la cantidad de un producto
const aumentarCantidad = async (id) => {
  setCart(cart.map((producto) => 
    producto.id === id
      ? { ...producto, cantidad: producto.cantidad + 1 }
      : producto
  ));

  // Obtener el producto actualizado
  const producto = cart.find((p) => p.id === id);

  // Actualizar el stock en el backend
  try {
    await axios.put(`http://localhost:4000/producto/${id}`, {
      cantidad_stock: producto.cantidad_stock - 1, // Reducir stock
    });
  } catch (err) {
    console.error("Error al actualizar el stock:", err);
  }
};

// Función para disminuir la cantidad de un producto
const disminuirCantidad = async (id) => {
  const producto = cart.find((p) => p.id === id);
  if (producto.cantidad > 1) {
    setCart(cart.map((producto) => 
      producto.id === id
        ? { ...producto, cantidad: producto.cantidad - 1 }
        : producto
    ));

    // Actualizar el stock en el backend
    try {
      await axios.put(`http://localhost:4000/producto/${id}`, {
        cantidad_stock: producto.cantidad_stock + 1, // Aumentar stock
      });
    } catch (err) {
      console.error("Error al actualizar el stock:", err);
    }
  }
};

  // Función para vaciar el carrito
  const vaciarCarrito = async () => {
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      setMensaje("No se encontró un token de autenticación.");
      return;
    }
  
    try {
      // Restaurar stock para todos los productos en el carrito
      for (let producto of cart) {
        await axios.put(`http://localhost:4000/producto/${producto.id}`, {
          cantidad_stock: producto.cantidad_stock + producto.cantidad, // Aumentar el stock según la cantidad
        });
      }
  
      await axios.delete("http://localhost:4000/carrito/vaciar", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setCart([]);
      setMensaje("Carrito vaciado correctamente.");
    } catch (error) {
      console.error("Error al vaciar el carrito", error);
      setMensaje("Hubo un error al vaciar el carrito.");
    }
  };

  // Función para confirmar el pedido
  const confirmarPedido = async () => {
    if (!user || cart.length === 0) {
      setMensaje("No hay productos en el carrito o no se ha encontrado el usuario.");
      return;
    }

    try {
      const pedido = {
        usuario_id: user.id,
        productos: cart.map((producto) => ({
          id: producto.id,
          cantidad: producto.cantidad,
          precio: producto.precio,
        })),
      };

      const response = await axios.post(
        "http://localhost:4000/pedido/confirmarPedido",
        pedido
      );
      setMensaje(response.data.mensaje);
      setCart([]);
      navigate("/");
    } catch (error) {
      console.error("Error al confirmar el pedido", error);
      setMensaje("Hubo un error al confirmar el pedido.");
    }
  };

  // Función para eliminar un producto del carrito
  const eliminarProducto = (id) => {
    setCart(cart.filter((producto) => producto.id !== id));
  };

  return (
    <div className="cart-container">
      <h2 className="cart-title">Carrito</h2>

      {cart.length === 0 ? (
        <p className="cart-empty-message">El carrito está vacío.</p>
      ) : (
        <div className="cart-products">
          {cart.map((producto) => (
            <div className="cart-item" key={producto.id}>
              <img
                src={`http://localhost:4000/${producto.imagen}`}
                alt={producto.nombre}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3 className="cart-item-title">{producto.nombre}</h3>
                <p className="cart-item-price">${producto.precio}</p>
                <p className="cart-item-quantity">
                  <button
                    className="quantity-button"
                    onClick={() => disminuirCantidad(producto.id)}
                    disabled={producto.cantidad <= 1}
                  >
                    -
                  </button>
                  {producto.cantidad}
                  <button
                    className="quantity-button"
                    onClick={() => aumentarCantidad(producto.id)}
                  >
                    +
                  </button>
                </p>
                <button
                  className="cart-item-remove"
                  onClick={() => eliminarProducto(producto.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="cart-actions">
        <button className="cart-action-button" onClick={vaciarCarrito}>
          Vaciar Carrito
        </button>
        <button
          className="cart-action-button"
          onClick={confirmarPedido}
          disabled={cart.length === 0}
        >
          Confirmar Pedido
        </button>
      </div>

      {mensaje && <p className="cart-message">{mensaje}</p>}
    </div>
  );
};

export default Cart;
