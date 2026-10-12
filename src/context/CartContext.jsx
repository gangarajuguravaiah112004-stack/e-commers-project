/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";

const CartContext = createContext(null);
const CART_API_URL = "https://6ac6469bbea0e72cf5c8cd31.mockapi.io/cart";

const toCartItem = (record) => {
  if (!record || typeof record !== "object") {
    throw new Error("The cart service returned an invalid item.");
  }

  const price = Number(record.price);
  const productId = record.productId;

  if (
    (typeof record.id !== "number" && typeof record.id !== "string") ||
    (typeof productId !== "number" && typeof productId !== "string") ||
    typeof record.title !== "string" ||
    !Number.isFinite(price) ||
    typeof record.thumbnail !== "string" ||
    !Number.isInteger(Number(record.quantity)) ||
    Number(record.quantity) < 1
  ) {
    throw new Error("The cart service returned an invalid item.");
  }

  return {
    id: productId,
    cartRecordId: record.id,
    title: record.title,
    price,
    thumbnail: record.thumbnail,
    quantity: Number(record.quantity),
    stock: Number.isInteger(Number(record.stock))
      ? Number(record.stock)
      : undefined,
  };
};

const getRequestError = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get(CART_API_URL);
        if (!Array.isArray(data)) {
          throw new Error("The cart service returned an invalid response.");
        }
        setItems(data.map(toCartItem));
      } catch (requestError) {
        const message = getRequestError(
          requestError,
          "Unable to load your cart."
        );
        setError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, []);

  const addToCart = useCallback(async (product) => {
    setError("");
    const existingItem = items.find((item) => item.id === product.id);

    try {
      if (existingItem) {
        const { data } = await axios.patch(
          `${CART_API_URL}/${existingItem.cartRecordId}`,
          { quantity: existingItem.quantity + 1 }
        );
        const updatedItem = toCartItem(data);
        setItems((currentItems) =>
          currentItems.map((item) =>
            item.cartRecordId === existingItem.cartRecordId
              ? updatedItem
              : item
          )
        );
        return;
      }

      const { data } = await axios.post(CART_API_URL, {
        productId: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: 1,
        stock: product.stock,
      });
      const createdItem = toCartItem(data);
      setItems((currentItems) => [...currentItems, createdItem]);
    } catch (requestError) {
      const message = getRequestError(requestError, "Unable to add this item.");
      setError(message);
      toast.error(message);
    }
  }, [items]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    const item = items.find((currentItem) => currentItem.id === productId);
    if (!item) return;

    const maximum = Number.isInteger(item.stock)
      ? Math.max(1, item.stock)
      : Number.MAX_SAFE_INTEGER;
    const nextQuantity = Math.min(Math.max(1, quantity), maximum);

    setError("");
    try {
      const { data } = await axios.patch(
        `${CART_API_URL}/${item.cartRecordId}`,
        { quantity: nextQuantity }
      );
      const updatedItem = toCartItem(data);
      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.cartRecordId === item.cartRecordId
            ? updatedItem
            : currentItem
        )
      );
    } catch (requestError) {
      const message = getRequestError(
        requestError,
        "Unable to update the item quantity."
      );
      setError(message);
      toast.error(message);
    }
  }, [items]);

  const removeFromCart = useCallback(async (productId) => {
    const item = items.find((currentItem) => currentItem.id === productId);
    if (!item) return;

    setError("");
    try {
      await axios.delete(`${CART_API_URL}/${item.cartRecordId}`);
      setItems((currentItems) =>
        currentItems.filter(
          (currentItem) => currentItem.cartRecordId !== item.cartRecordId
        )
      );
    } catch (requestError) {
      const message = getRequestError(
        requestError,
        "Unable to remove this item."
      );
      setError(message);
      toast.error(message);
    }
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      isLoading,
      error,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      subtotal: items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
      addToCart,
      updateQuantity,
      removeFromCart,
    }),
    [
      items,
      isLoading,
      error,
      addToCart,
      updateQuantity,
      removeFromCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider.");
  }
  return context;
};
