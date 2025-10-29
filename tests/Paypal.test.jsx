import { render } from "@testing-library/react";
import PayPalButton from "../src/components/PaypalButton/PaypalButton.jsx";

describe("PayPalButton Component - lógica", () => {
  let buttonsMock;
  let renderMock;

  beforeEach(() => {
    // --- Limpiar cualquier mock previo y DOM ---
    document.body.innerHTML = "";
    delete window.paypal;

    // --- Mock de Buttons incluyendo createOrder y onApprove ---
    renderMock = jest.fn();
    buttonsMock = jest.fn().mockImplementation((config) => {
      // Guardamos las funciones para poder llamarlas en los tests
      return {
        render: renderMock,
        createOrder: config.createOrder,
        onApprove: config.onApprove,
      };
    });

    window.paypal = { Buttons: buttonsMock };

    // --- Mock global.fetch para todos los endpoints de Paypal ---
    global.fetch = jest.fn((url) => {
      if (url.includes("/api/paypal-client-id"))
        return Promise.resolve({
          json: () => Promise.resolve({ clientId: "TEST_CLIENT_ID" }),
        });
      if (url.includes("/api/create-order"))
        return Promise.resolve({
          json: () => Promise.resolve({ id: "ORDER123" }),
        });
      if (url.includes("/api/capture-order"))
        return Promise.resolve({
          json: () => Promise.resolve({ status: "COMPLETED" }),
        });
      return Promise.resolve({ json: () => Promise.resolve({}) });
    });
  });

  // --- Test que comprueba que se llama a Buttons y renderiza la lógica ---
  it("invoca Buttons y renderiza la lógica del botón", async () => {
    const onSuccessMock = jest.fn();
    render(
      <PayPalButton amount={100} currency="USD" onSuccess={onSuccessMock} />
    );

    // Espera pequeña para que el useEffect corra y llame a Buttons
    await new Promise((r) => setTimeout(r, 50));

    expect(buttonsMock).toHaveBeenCalled();
    expect(renderMock).toHaveBeenCalled();
  });

  // --- Test que verifica createOrder y onApprove ---
  it("createOrder y onApprove ejecutan los fetch correctos y llaman a onSuccess", async () => {
    const onSuccessMock = jest.fn();
    render(
      <PayPalButton amount={100} currency="USD" onSuccess={onSuccessMock} />
    );

    // Espera un poco para que el useEffect corra y llame a los Botones.
    await new Promise((r) => setTimeout(r, 50));

    // --- Obtenemos la instancia mockeada con createOrder/onApprove ---
    const buttonsInstance = buttonsMock.mock.results[0].value;

    // --- createOrder debe llamar a /api/create-order y devolver id ---
    const orderId = await buttonsInstance.createOrder();
    expect(orderId).toBe("ORDER123");
    expect(fetch).toHaveBeenCalledWith("/api/create-order", expect.any(Object));

    // --- onApprove debe llamar a /api/capture-order y disparar onSuccess ---
    await buttonsInstance.onApprove({ orderID: "ORDER123" });
    expect(fetch).toHaveBeenCalledWith(
      "/api/capture-order/ORDER123",
      expect.any(Object)
    );
    expect(onSuccessMock).toHaveBeenCalledWith({ status: "COMPLETED" });
  });
});
