import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import Loader from "../components/loader/Loader";

function AuthWrapper({ children }: { children: JSX.Element }) {
  const [user, loading] = useAuthState(auth);

  if (loading) return <Loader />

  return user ? children : <Navigate to="/login" />;
}

export default AuthWrapper;
