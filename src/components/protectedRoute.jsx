import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ user, allowedRoles, children }) => {
  return user ? children : <Navigate to="/"></Navigate>;
};

export { ProtectedRoute };
