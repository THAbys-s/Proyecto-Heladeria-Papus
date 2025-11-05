# test_tiendas.py
import app
def test_get_tiendas_ok(client):
    res = client.get("/api/tiendas")
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    assert data[11]["direccion"] == "Francisco Camet 4591, Barrio Olímpico"