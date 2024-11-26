import { Navigate, useLocation  } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Loader from "../components/loader/Loader";

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const auth = useAuth();
    const location = useLocation();
    
    if (!auth || auth.loading) return <Loader />

    const pathSegments = location.pathname.split("/").filter(Boolean);
    const countryFromPath = pathSegments[0] || "";

    if (auth.role === "admin") return children

    if (auth.role === "user" && countryFromPath !== auth.country)
        return <Navigate to={`/${auth.country}`} />;
    
    return children
}

export default ProtectedRoute;