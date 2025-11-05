# test_empleados.py
import app
def test_get_empleados_por_tienda(client):
    res = client.get("/api/tiendas/1/empleados")
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    assert data[0]["nombre"] == "Diego"  # Asegúrate de que este valor exista en la base de datos real
