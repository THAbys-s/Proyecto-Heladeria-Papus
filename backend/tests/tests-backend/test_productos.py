# test_productos.py
import app

def test_get_productos_lista(client):
    res = client.get("/api/productos")
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "nombre" in data[0]
    assert "precio" in data[0]
    assert "descuento" in data[0]


def test_get_producto_por_id(client):
    res = client.get("/api/productos/1")
    assert res.status_code == 200
    data = res.get_json()
    assert data["id"] == 1
    assert "nombre" in data
    assert "precio" in data
    assert "precioOriginal" in data
    assert "descuento" in data
    
def test_buscar_producto_por_nombre(client):
    res = client.get("/api/productos?nombre=Crujido Tentador")
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert "nombre" in data[0]
    assert data[0]["nombre"] == "Crujido Tentador"    

def test_get_producto_inexistente(client):
    res = client.get("/api/productos/999999")
    assert res.status_code in (404, 400)


