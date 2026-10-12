import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { routes } from "./routes/routes";
import { CartProvider } from "./context/CartContext";

const App = () => {
  return (
    <>
      <CartProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <RouterProvider router={routes} />
        </Suspense>
      </CartProvider>
      <ToastContainer />
    </>
  );
};

export default App;