import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import './App.css';
import AdminPanel from './components/panel/AdminPanel';
import Login from "./components/auth/Login";
import AuthWrapper from "./components/auth/AuthWrapper";

function App() {
  const queryClient = new QueryClient();
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
