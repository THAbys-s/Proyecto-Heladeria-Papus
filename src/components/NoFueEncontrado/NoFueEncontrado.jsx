import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        paddingTop: "15px",
        paddingBottom: "15px",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
        color: "#333",
        fontFamily: "sans-serif",
        borderRadius: "5px",
        border: "2px solid black",
      }}
    >
      <h1 style={{ fontSize: "6rem", margin: "0" }}> 404 </h1>
      <h2 style={{ marginBottom: "1rem" }}> Página no encontrada </h2>
      <p style={{ marginBottom: "2rem" }}>
        {" "}
        La ruta que intentaste acceder no existe o fue movida.{" "}
      </p>
      <Link
        to="/home"
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: "#55a4ab",
          color: "#fff",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
        }}
      >
        Volver al inicio
      </Link>
    </div>
  );
}

export default NotFound;
