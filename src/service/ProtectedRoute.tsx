import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

interface ProtectedRouteProps {
    children: JSX.Element;
    requiredRole: "admin" | "user"; // e.g., 'admin' or 'user'
    requiredCountry?: string; // Optional for user-specific countries
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole, requiredCountry }) => {
    const auth = useAuth();

    if (auth?.role === "admin") return children

    if (requiredRole === "user" && auth?.country !== requiredCountry) 
        return <Navigate to={`/${auth?.country}`} />;
    
    return children
}

export default ProtectedRoute;