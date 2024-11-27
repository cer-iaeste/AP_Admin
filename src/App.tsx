import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import './App.css';
import AdminPanel from './components/panel/AdminPanel';
import Login from "./components/auth/Login";
import AuthWrapper from "./service/AuthWrapper";
import { AuthProvider } from "./service/AuthProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const queryClient = new QueryClient();
  return (
    <div className="App">
      <ToastContainer />
      <AuthProvider>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <header className='max-w-full'>
              <Routes>
                <Route path="/login" element={<Login />} />
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
