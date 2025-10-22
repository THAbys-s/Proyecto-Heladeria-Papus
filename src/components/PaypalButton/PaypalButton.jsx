import { useEffect, useRef } from "react";

const PayPalButton = ({
  amount = 0,
  currency = "USD",
  description,
  onSuccess,
}) => {
  const containerRef = useRef(null);
  const scriptRef = useRef(null);

  useEffect(() => {
    // evitar cargar el script varias veces y limpiar contenedor antes de cada render
    let isMounted = true;
    const createdScript = { current: false };

    const renderButtons = async () => {
      if (!containerRef.current) return;
      // limpiar cualquier botón previo para evitar duplicados
      containerRef.current.innerHTML = "";
      try {
        window.paypal
          .Buttons({
            createOrder: async () => {
              const res = await fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ total: String(amount), currency }),
              });
              const data = await res.json();
              return data.id || data.orderID || data.orderId;
            },
            onApprove: async (data) => {
              const res = await fetch(
                `/api/capture-order/${data.orderID || data.orderId}`,
                {
                  method: "POST",
                }
              );
              const details = await res.json();
              if (onSuccess) onSuccess(details);
            },
          })
          .render(containerRef.current);
      } catch (e) {
        console.error("Paypal render error:", e);
      }
    };

    const load = async () => {
      // pedir client id al backend
      let clientId = "";
      try {
        const res = await fetch("/api/paypal-client-id");
        const json = await res.json();
        clientId = json.clientId || "";
      } catch (e) {
        console.warn(
          "No se pudo obtener PAYPAL_CLIENT_ID desde el backend, usando client-id vacío",
          e
        );
      }
      // comprobar si ya existe un script de PayPal en la página
      const existingScript = Array.from(
        document.getElementsByTagName("script")
      ).find((s) => s.src && s.src.includes("paypal.com/sdk/js"));

      const cid = clientId || "";

      if (window.paypal) {
        // SDK ya listo -> renderizar y salir
        renderButtons();
        return;
      }

      if (existingScript) {
        // si hay un script cargándose o cargado, usarlo y esperar al evento load
        scriptRef.current = existingScript;
        const handle = () => {
          if (!isMounted) return;
          renderButtons();
        };
        existingScript.addEventListener("load", handle);
        // si ya está cargado, window.paypal podría no estar disponible inmediatamente,
        // así que también intentamos renderizar con un pequeño timeout por si ya está listo
        setTimeout(() => {
          if (window.paypal) renderButtons();
        }, 50);
        return;
      }

      // crear script nuevo
      const script = document.createElement("script");
      script.setAttribute("data-paypal", "true");
      script.src = `https://www.paypal.com/sdk/js?client-id=${cid}&currency=${currency}`;
      script.async = true;
      scriptRef.current = script;
      createdScript.current = true;

      const handleLoad = () => {
        if (!isMounted) return;
        renderButtons();
      };

      script.addEventListener("load", handleLoad);
      document.body.appendChild(script);
    };

    load();

    return () => {
      isMounted = false;
      // remover listener sólo si existe
      try {
        if (scriptRef.current) {
          scriptRef.current.removeEventListener("load", renderButtons);
        }
      } catch (e) {}
      // si creamos el script, lo removemos; si no, lo dejamos para otras instancias
      try {
        if (
          scriptRef.current &&
          scriptRef.current.getAttribute &&
          scriptRef.current.getAttribute("data-paypal") === "true"
        ) {
          if (scriptRef.current.parentNode)
            scriptRef.current.parentNode.removeChild(scriptRef.current);
        }
      } catch (e) {}
      // limpiar el contenedor de botones (paypal usa iframes)
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [amount, currency, onSuccess]);

  return <div ref={containerRef} id="paypal-button-container"></div>;
};

export default PayPalButton;
