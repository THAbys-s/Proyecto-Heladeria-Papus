# test_bocadillos.py
import app
def test_get_bocadillos_ok(client, mocker):
    """
    ✅ Testea que /api/bocadillos devuelva una lista mockeada.
    """
    fake_bocadillos = [{"nombre_bocadillo": "Bombón Escocés"}, {"nombre_bocadillo": "Dulce Suspiro"}]

    class FakeCursor:
        def execute(self, sql): pass
        def fetchall(self): return fake_bocadillos
        def close(self): pass

    class FakeConn:
        def cursor(self): return FakeCursor()
        def close(self): pass

    mocker.patch.object(app, "abrirConexion", return_value=FakeConn())

    res = client.get("/api/bocadillos")
    assert res.status_code == 200
    data = res.get_json()
    assert data == ["Bombón Escocés", "Dulce Suspiro"]
