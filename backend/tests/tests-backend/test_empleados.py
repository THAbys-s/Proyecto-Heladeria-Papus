# test_empleados.py
import app
def test_get_empleados_por_tienda(client, mocker):
    """
    ✅ Testea /api/tiendas/<id>/empleados con datos simulados.
    """
    fake_empleados = [
        {"nombre": "Carlos", "apellido": "Gómez"},
        {"nombre": "Lucía", "apellido": "Pérez"},
    ]

    class FakeCursor:
        def execute(self, sql, params): pass
        def fetchall(self): return fake_empleados
        def close(self): pass

    class FakeConn:
        def cursor(self): return FakeCursor()
        def close(self): pass

    mocker.patch.object(app, "abrirConexion", return_value=FakeConn())

    res = client.get("/api/tiendas/1/empleados")
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    assert data[0]["nombre"] == "Carlos"
