# test_cucuruchos.py
import app
def test_get_cucuruchos_ok(client, mocker):
    """
    ✅ Testea que /api/cucuruchos devuelva lista mockeada.
    """
    fake_cucuruchos = [{"nombre_cucurucho": "Clásico"}, {"nombre_cucurucho": "Doble"}]

    class FakeCursor:
        def execute(self, sql): pass
        def fetchall(self): return fake_cucuruchos
        def close(self): pass

    class FakeConn:
        def cursor(self): return FakeCursor()
        def close(self): pass

    mocker.patch.object(app, "abrirConexion", return_value=FakeConn())

    res = client.get("/api/cucuruchos")
    assert res.status_code == 200
    data = res.get_json()
    assert data == ["Clásico", "Doble"]