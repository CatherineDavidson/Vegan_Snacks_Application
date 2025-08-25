import { Navigate } from "react-router-dom";

// roles: array of allowed roles for the route
const ProtectedRoute = ({ children, roles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    // user is not logged in
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(role)) {
    // user role not allowed
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
