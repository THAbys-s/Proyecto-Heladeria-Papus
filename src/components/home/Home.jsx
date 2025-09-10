import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./home.css";

export function Home() {
  const [sabores, setSabores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/sabores")
      .then((res) => res.json())
      .then((data) => setSabores(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <header></header>
      <h3>{sabores}</h3>
      <ul></ul>
      <main></main>
    </div>
  );
}
