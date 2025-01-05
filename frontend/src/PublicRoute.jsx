import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const { token } = useSelector((state) => state.auth); 

  return token ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
