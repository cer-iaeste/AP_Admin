import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import './App.css';
import AdminPanel from './components/admin-panel/AdminPanel';
import Login from "./components/auth/Login";
import AuthWrapper from "./service/AuthWrapper";
import { AuthProvider } from "./service/AuthProvider";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";
import AuthService from "./service/AuthService";
import Signup from "./components/auth/Signup";

function App() {
  const queryClient = new QueryClient();

  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      try {
        await AuthService.refreshToken()
      } catch (error: any) {
        toast.error("Failed to refresh token: ", error)
      }
    }, 30 * 60 * 1000) // refresh every 30 mins

    return () => clearInterval(refreshInterval)
  }, [])


  return (
    <div className="App">
      <ToastContainer />
      <AuthProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <header className='max-w-full'>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Signup />} />
                <Route
                  path="*"
                  element={
                    <AuthWrapper>
                      <AdminPanel />
                    </AuthWrapper>
                  }
                />
              </Routes>
            </header>
          </QueryClientProvider>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
