import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import Loader from "../components/loader/Loader";
import { useCountryFromPath } from "../global/Global";

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const auth = useAuth();
    const countryFromPath = useCountryFromPath()

    if (!auth || auth.loading) return <Loader />

    if (auth.role === "admin") return children

    if (auth.role === "user" && countryFromPath !== auth.country)
        return <Navigate to={`/countries/${auth.country}`} />;
    
    return children
}

export default ProtectedRoute;