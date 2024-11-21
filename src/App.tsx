import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import './App.css';
import AdminPanel from './components/panel/AdminPanel';

function App() {
  const queryClient = new QueryClient();
  return (
    <div className="App">
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <header className='max-w-full'>
            <Routes>
              <Route path='*' element={<AdminPanel />} />
            </Routes>
          </header>
        </QueryClientProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
