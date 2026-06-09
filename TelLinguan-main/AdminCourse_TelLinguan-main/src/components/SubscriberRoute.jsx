import { Navigate } from "react-router-dom";

const SubscriberRoute = ({ children }) => {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!user.subscribed) {
    return <Navigate to="/Subscribe" replace />;
  }

  return children;
};

export default SubscriberRoute;