# test_salsas_y_especiales.py
import app
def test_get_salsas_ok(client, mocker):
    """
    ✅ Testea que /api/salsas devuelva lista mockeada.
    """
    fake_salsas = [{"nombre_salsa": "Chocolate"}, {"nombre_salsa": "Caramelo"}]

    class FakeCursor:
        def execute(self, sql): pass
        def fetchall(self): return fake_salsas
        def close(self): pass

    class FakeConn:
        def cursor(self): return FakeCursor()
        def close(self): pass

    mocker.patch.object(app, "abrirConexion", return_value=FakeConn())

    res = client.get("/api/salsas")
    assert res.status_code == 200
    data = res.get_json()
    assert data == ["Chocolate", "Caramelo"]


def test_get_especiales_ok(client, mocker):
    """
    ✅ Testea que /api/especiales devuelva lista mockeada.
    """
    fake_especiales = [{"nombre_especial": "Trio Tentador"}, {"nombre_especial": "Sueño Chocolatoso"}]

    class FakeCursor:
        def execute(self, sql): pass
        def fetchall(self): return fake_especiales
        def close(self): pass

    class FakeConn:
        def cursor(self): return FakeCursor()
        def close(self): pass

    mocker.patch.object(app, "abrirConexion", return_value=FakeConn())

    res = client.get("/api/especiales")
    assert res.status_code == 200
    data = res.get_json()
    assert data == ["Trio Tentador", "Sueño Chocolatoso"]
