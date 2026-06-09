import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLogin = localStorage.getItem("token");
  const location = useLocation();

  if (!isLogin) {
    return <Navigate to="/Login" state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;