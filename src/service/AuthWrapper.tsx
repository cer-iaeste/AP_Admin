import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import Loader from "../components/loader/Loader";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { emptyLocalStorage } from "../global/Global";
import AuthService from "./AuthService";

const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token)
    const now = Date.now() / 1000 // convert to seconds
    return decoded.exp ? decoded.exp > now : false
  } catch {
    return false
  }
}

function AuthWrapper({ children }: { children: JSX.Element }) {
  const [user, loading] = useAuthState(auth);
  const token = localStorage.getItem("authToken")

  if (loading) return <Loader />

  if (!user || !token || !isTokenValid(token)) {
    AuthService.refreshToken().catch(() => emptyLocalStorage())
    return <Navigate to="/login" />;
  }
  return children
}

export default AuthWrapper;
