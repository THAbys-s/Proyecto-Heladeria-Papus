# test_tiendas.py
import app
def test_get_tiendas_ok(client, mocker):
    """
    ✅ Testea que /api/tiendas devuelva tiendas simuladas.
    """
    fake_tiendas = [
        {"tienda_id": 1, "direccion": "Calle Falsa 123"},
        {"tienda_id": 2, "direccion": "Av. Siempre Viva 742"},
    ]

    class FakeCursor:
        def execute(self, sql): pass
        def fetchall(self): return fake_tiendas
        def close(self): pass

    class FakeConn:
        def cursor(self): return FakeCursor()
        def close(self): pass

    mocker.patch.object(app, "abrirConexion", return_value=FakeConn())

    res = client.get("/api/tiendas")
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    assert data[0]["direccion"] == "Calle Falsa 123"
