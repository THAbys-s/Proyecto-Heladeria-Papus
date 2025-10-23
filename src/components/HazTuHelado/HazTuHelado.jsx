import React, { useEffect, useState } from "react";
import "./haztuhelado.css";
import PaypalButton from "../PaypalButton/PaypalButton.jsx";

const HazTuHelado = () => {
  const [sabores, setSabores] = useState([]);
  const [especiales, setEspeciales] = useState([]);
  const [bocadillos, setBocadillos] = useState([]);
  const [cucuruchos, setCucuruchos] = useState([]);
  const [salsas, setSalsas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCucurucho, setSelectedCucurucho] = useState("");
  const [selectedSabores, setSelectedSabores] = useState([]);
  const [selectedEspeciales, setSelectedEspeciales] = useState([]);
  const [selectedBocadillo, setSelectedBocadillo] = useState("");
  const [selectedSalsa, setSelectedSalsa] = useState("");
  const [carrito, setCarrito] = useState(() => {
    const savedCart = localStorage.getItem("carritoHelados");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [step, setStep] = useState(0); // 0: cucurucho, 1: sabores, 2: bocadillo, 3: salsas, 4: revisión/confirmar

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          "http://localhost:5000/api/sabores",
          "http://localhost:5000/api/especiales",
          "http://localhost:5000/api/bocadillos",
          "http://localhost:5000/api/cucuruchos",
          "http://localhost:5000/api/salsas",
        ];

        const responses = await Promise.all(endpoints.map((url) => fetch(url)));

        responses.forEach((res, i) => {
          if (!res.ok) {
            console.error(
              `❌ Error al obtener ${endpoints[i]} — Código: ${res.status}`
            );
          } else {
            console.log(`✅ OK: ${endpoints[i]}`);
          }
        });
        const [
          saboresData,
          especialesData,
          bocadillosData,
          cucuruchosData,
          salsasData,
        ] = await Promise.all(responses.map((res) => res.json()));

        console.log("📦 Datos recibidos:", {
          sabores: saboresData,
          especiales: especialesData,
          bocadillos: bocadillosData,
          cucuruchos: cucuruchosData,
          salsas: salsasData,
        });

        if (
          !Array.isArray(saboresData) ||
          !Array.isArray(especialesData) ||
          !Array.isArray(bocadillosData) ||
          !Array.isArray(cucuruchosData) ||
          !Array.isArray(salsasData)
        ) {
          throw new Error("Formato de datos inválido en una o más respuestas");
        }

        setSabores(saboresData);
        setEspeciales(especialesData);
        setBocadillos(bocadillosData);
        setCucuruchos(cucuruchosData);
        setSalsas(salsasData);

        setError("");
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError("No se pudieron cargar todos los datos del servidor.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Reglas de selección de sabores según cucurucho
  const getMaxSabores = () => {
    const sc = selectedCucurucho.toLowerCase();
    if (sc.includes("simple")) return 1;
    if (sc.includes("doble") || sc.includes("1/4")) return 3;
    if (sc.includes("capelina")) return 3;
    if (selectedCucurucho.toLowerCase().includes("1kg")) return 5;
    if (selectedCucurucho.toLowerCase().includes("1/2kg")) return 4;
    return 1;
  };

  // Selección de cucurucho
  const handleCucurucho = (nombre) => {
    if (selectedCucurucho === nombre) {
      setSelectedCucurucho("");
      setSelectedSabores([]);
      setSelectedEspeciales([]);
    } else {
      setSelectedCucurucho(nombre);
      setSelectedSabores([]);
      setSelectedEspeciales([]);
    }
  };

  // Selección de sabores
  const handleSabor = (nombre) => {
    const max = getMaxSabores();
    const total = selectedSabores.length + selectedEspeciales.length;
    if (selectedSabores.includes(nombre)) {
      setSelectedSabores(selectedSabores.filter((s) => s !== nombre));
    } else if (total < max) {
      setSelectedSabores([...selectedSabores, nombre]);
    }
  };

  // Selección de especiales
  const handleEspecial = (nombre) => {
    const max = getMaxSabores();
    const total = selectedSabores.length + selectedEspeciales.length;
    if (selectedEspeciales.includes(nombre)) {
      setSelectedEspeciales(selectedEspeciales.filter((e) => e !== nombre));
    } else if (total < max) {
      setSelectedEspeciales([...selectedEspeciales, nombre]);
    }
  };

  // Selección de bocadillo
  const handleBocadillo = (nombre) => {
    setSelectedBocadillo(selectedBocadillo === nombre ? "" : nombre);
  };

  // Selección de salsa
  const handleSalsa = (nombre) => {
    setSelectedSalsa(selectedSalsa === nombre ? "" : nombre);
  };

  // Agregar al carrito
  useEffect(() => {
    localStorage.setItem("carritoHelados", JSON.stringify(carrito));
  }, [carrito]);

  const confirmarHelado = () => {
    const helado = {
      cucurucho: selectedCucurucho,
      sabores: [...selectedSabores, ...selectedEspeciales],
      bocadillo: selectedBocadillo,
      salsa: selectedSalsa,
      cantidad: 1,
      id: Date.now(),
    };
    setCarrito((prev) => [...prev, helado]);
    // Limpiar selección
    setSelectedCucurucho("");
    setSelectedSabores([]);
    setSelectedEspeciales([]);
    setSelectedBocadillo("");
    setSelectedSalsa("");
  };

  const removeFromCarrito = (id) => {
    setCarrito((prev) => prev.filter((p) => p.id !== id));
  };

  const pedirOtroHelado = () => {
    setStep(0);
  };

  const handleNext = () => {
    // validations por paso
    if (step === 0 && !selectedCucurucho) return; // require cucurucho
    if (step === 1 && [...selectedSabores, ...selectedEspeciales].length === 0)
      return;
    // avanzar
    setStep((s) => Math.min(4, s + 1));
  };

  const handleBack = () => {
    setStep((s) => Math.max(0, s - 1));
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Cargando datos, por favor espere...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Reintentar</button>
      </div>
    );
  }

  return (
    <div className="haztuhelado-container">
      <h1>Personaliza tu helado</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: "1rem",
          maxWidth: 980,
          margin: "1rem auto",
        }}
      >
        {/* Formulario (left) */}
        <div className="haztu-card">
          <div className="haztu-step-header">
            <div>
              <div className="haztu-step-title">
                {step === 0 && "Elija su cucurucho"}
                {step === 1 && "Elija sabores y especiales"}
                {step === 2 && "Elija bocadillo"}
                {step === 3 && "Elija salsa"}
                {step === 4 && "Revise y confirme"}
              </div>
              <div className="haztu-step-subtitle">
                Siga los pasos para crear su helado
              </div>
            </div>
            <div className="step-indicator">
              <div className={`step-dot ${step === 0 ? "active" : ""}`}></div>
              <div className={`step-dot ${step === 1 ? "active" : ""}`}></div>
              <div className={`step-dot ${step === 2 ? "active" : ""}`}></div>
              <div className={`step-dot ${step === 3 ? "active" : ""}`}></div>
              <div className={`step-dot ${step === 4 ? "active" : ""}`}></div>
            </div>
          </div>

          <div>
            {step === 0 && (
              <div>
                <div className="haztu-grid-single">
                  {cucuruchos.map((cucurucho, idx) => (
                    <button
                      key={"cucurucho-" + idx}
                      onClick={() => handleCucurucho(cucurucho)}
                      className={`helado-btn${
                        cucurucho === selectedCucurucho ? " selected" : ""
                      }`}
                    >
                      {cucurucho}
                    </button>
                  ))}
                </div>
                <div className="haztu-nav">
                  <div />
                  <button className="haztu-btn-primary" onClick={handleNext}>
                    Siguiente
                  </button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <div className="haztu-grid-inner">
                  <div>
                    <h4 style={{ color: "#ff6e72" }}>Sabores</h4>
                    <div className="haztu-grid-single">
                      {sabores.map((sabor, idx) => (
                        <button
                          key={"sabor-" + idx}
                          onClick={() => handleSabor(sabor)}
                          className={`helado-btn${
                            selectedSabores.includes(sabor) ? " selected" : ""
                          }`}
                          disabled={
                            selectedSabores.length >= getMaxSabores() &&
                            !selectedSabores.includes(sabor)
                          }
                        >
                          {sabor}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 style={{ color: "#65B7DA" }}>Sabores Especiales</h4>
                    <div className="haztu-grid-single">
                      {especiales.map((especial, idx) => (
                        <button
                          key={"especial-" + idx}
                          onClick={() => handleEspecial(especial)}
                          className={`helado-btn${
                            selectedEspeciales.includes(especial)
                              ? " selected"
                              : ""
                          }`}
                          disabled={
                            selectedEspeciales.length >= getMaxSabores() &&
                            !selectedEspeciales.includes(especial)
                          }
                        >
                          {especial}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="haztu-nav">
                  <button className="haztu-btn-secondary" onClick={handleBack}>
                    Deshacer
                  </button>
                  <button className="haztu-btn-primary" onClick={handleNext}>
                    Siguiente
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h4 style={{ color: "#DD7E6B" }}>Bocadillos</h4>
                <div className="haztu-grid-single">
                  {bocadillos.map((bocadillo, idx) => (
                    <button
                      key={"bocadillo-" + idx}
                      onClick={() => handleBocadillo(bocadillo)}
                      className={`helado-btn${
                        bocadillo === selectedBocadillo ? " selected" : ""
                      }`}
                    >
                      {bocadillo}
                    </button>
                  ))}
                </div>
                <div className="haztu-nav">
                  <button className="haztu-btn-secondary" onClick={handleBack}>
                    Deshacer
                  </button>
                  <button className="haztu-btn-primary" onClick={handleNext}>
                    Siguiente
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h4 style={{ color: "#FCBA78" }}>Salsas</h4>
                <div className="haztu-grid-single">
                  {salsas.map((salsa, idx) => (
                    <button
                      key={"salsa-" + idx}
                      onClick={() => handleSalsa(salsa)}
                      className={`helado-btn${
                        salsa === selectedSalsa ? " selected" : ""
                      }`}
                    >
                      {salsa}
                    </button>
                  ))}
                </div>
                <div className="haztu-nav">
                  <button className="haztu-btn-secondary" onClick={handleBack}>
                    Deshacer
                  </button>
                  <button className="haztu-btn-primary" onClick={handleNext}>
                    Siguiente
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h4>Resumen del helado</h4>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 12,
                    color: "var(--black)",
                  }}
                >
                  {selectedCucurucho && (
                    <div className="helado-chip">{selectedCucurucho}</div>
                  )}
                  {[...selectedSabores, ...selectedEspeciales].map((s, i) => (
                    <div key={i} className="helado-chip">
                      {s}
                    </div>
                  ))}
                  {selectedBocadillo && (
                    <div className="helado-chip">{selectedBocadillo}</div>
                  )}
                  {selectedSalsa && (
                    <div className="helado-chip">{selectedSalsa}</div>
                  )}
                </div>
                <div className="haztu-nav">
                  <button className="haztu-btn-secondary" onClick={handleBack}>
                    Deshacer
                  </button>
                  <button
                    className="haztu-btn-primary"
                    onClick={() => {
                      confirmarHelado();
                      setStep(0);
                    }}
                  >
                    Confirmar helado
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pedidos (right) - siempre visible */}
        <div>
          <div className="mini-carrito">
            <h4 style={{ margin: "0 0 .5rem 0" }}>Tus pedidos</h4>
            {carrito.length === 0 ? (
              <div style={{ color: "var(--black)" }}>No hay pedidos</div>
            ) : (
              <ul style={{ padding: 0, listStyle: "none", margin: 0 }}>
                {carrito.map((item) => (
                  <li
                    key={item.id}
                    style={{
                      marginBottom: 10,
                      borderBottom: "1px solid #eee",
                      paddingBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700 }}>{item.cucurucho}</div>
                        <div style={{ fontSize: ".9rem" }}>
                          {item.sabores.join(", ")}
                        </div>
                      </div>
                      <div>
                        <button
                          className="haztu-btn-secondary"
                          onClick={() => removeFromCarrito(item.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {carrito.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <PaypalButton
                  amount={12000} // 👈 poné acá el total real si querés
                  description={`Compra de ${carrito.length} helado(s) personalizados`}
                  onSuccess={(details) => {
                    alert(
                      `Pago completado por ${details.payer.name.given_name}`
                    );

                    setCarrito([]); // vacía el carrito tras el pago
                  }}
                />
              </div>
            )}
            <button
              className="haztu-btn-secondary"
              style={{ marginTop: 8 }}
              onClick={pedirOtroHelado}
            >
              Pedir otro helado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HazTuHelado;
