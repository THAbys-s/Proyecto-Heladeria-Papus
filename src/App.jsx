import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import PrincipalPage from "./pages/Principal";
import LoadingPage from "./pages/Loading";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Cuando pasan los dos segundos, setea loading a false
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<PrincipalPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
