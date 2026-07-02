import API from "../api/axios";
import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

function CartProvider({ children }) {

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {

    const fetchCart = async () => {

      try {

        const userId = localStorage.getItem("userId");

        if (!userId) return;

        const response = await API.get(`/api/cart/${userId}`);

        console.log("Fetched cart:", response.data);

        const backendItems = response.data.items.map((item) => ({
          cartItemId: item.cartItemId,
          id: item.foodItemId,
          name: item.foodItemName,
          imageUrl: item.imageUrl,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
        }));

        setCartItems(backendItems);

      } catch (error) {

        console.log("Failed to fetch cart:", error);
      }
    };

    fetchCart();

  }, []);

  const addToCart = async (food) => {

    try {

      const response = await API.post("/api/cart/add", {
        userId: Number(localStorage.getItem("userId")),
        foodItemId: Number(food.id),
        quantity: 1,
      });

      console.log("Backend cart updated:", response.data);

      window.location.reload();

    } catch (error) {

      console.log(error);

      alert("Failed to add item to cart");
    }
  };

  const increaseQuantity = async (cartItemId, currentQuantity) => {

    try {

      await API.put(
        `/api/cart/item/${cartItemId}?quantity=${currentQuantity + 1}`
      );

      setCartItems((prev) =>
        prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );

    } catch (error) {

      console.log(error);
    }
  };

  const decreaseQuantity = async (cartItemId, currentQuantity) => {

    try {

      if (currentQuantity <= 1) {

        await removeFromCart(cartItemId);

        return;
      }

      await API.put(
        `/api/cart/item/${cartItemId}?quantity=${currentQuantity - 1}`
      );

      setCartItems((prev) =>
        prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );

    } catch (error) {

      console.log(error);
    }
  };

  const removeFromCart = async (cartItemId) => {

    try {

      await API.delete(`/api/cart/item/${cartItemId}`);

      setCartItems((prev) =>
        prev.filter((item) => item.cartItemId !== cartItemId)
      );

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;