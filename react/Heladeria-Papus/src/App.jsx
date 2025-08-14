import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importa todos los componentes de la carpeta pages
const pages = import.meta.glob("./pages/*.jsx", { eager: true });

function getRoutes() {
  return Object.entries(pages).map(([path, module]) => {
    // Extrae el nombre del archivo sin extensión
    const name = path.match(/\.\/pages\/(.*)\.jsx$/)[1];
    // Define la ruta (ejemplo: Home.jsx => "/")
    const routePath =
      name.toLowerCase() === "home" ? "/" : `/${name.toLowerCase()}`;
    return (
      <Route
        key={routePath}
        path={routePath}
        element={module.default ? <module.default /> : null}
      />
    );
  });
}

function App() {
  return (
    <BrowserRouter>
      <Routes>{getRoutes()}</Routes>
    </BrowserRouter>
  );
}

export default App;
