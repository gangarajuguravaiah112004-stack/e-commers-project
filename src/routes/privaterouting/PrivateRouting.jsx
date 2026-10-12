import { Navigate } from "react-router-dom";

const PrivateRouting = ({ children }) => {
  const token = (() => {
    try {
      const savedToken = localStorage.getItem("jwt_token");
      return savedToken ? JSON.parse(savedToken) : null;
    } catch {
      return null;
    }
  })();

  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRouting;