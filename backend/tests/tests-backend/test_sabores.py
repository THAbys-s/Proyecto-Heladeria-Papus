# test_sabores.py
import app
def test_get_sabores_ok(client):
    res = client.get("/api/sabores")
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    assert "Chocolate" in data


def test_get_sabor_por_id(client):
    res = client.get("/api/sabores/1")
    assert res.status_code == 200
    data = res.get_json()
    assert "id" in data
    assert data["id"] == 1
    assert "nombre_sabor" in data
    assert data["nombre_sabor"] == "Vainilla"