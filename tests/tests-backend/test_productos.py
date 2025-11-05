# Definición de la clase FakeConn
class FakeConn:
    def cursor(self):
        return self
    
    def execute(self, query):
        # Simulamos la ejecución de la consulta sin hacer nada
        return self
    
    def fetchall(self):
        # Retornamos una lista de productos simulados
        return [
            {"id": 1, "nombre": "Leche Descremada 1L", "precio": 350, "stock": 20},
            {"id": 2, "nombre": "Queso Rallado", "precio": 500, "stock": 10}
        ]
    
    def close(self):
        pass

# El test de productos
def test_get_productos_lista(client, mocker):
    """
    ✅ Testea que /api/productos devuelva una lista de productos simulados.
    """
    # Aquí mockeamos `abrirConexion` para que devuelva una conexión falsa
    mocker.patch("app.abrirConexion", return_value=FakeConn())

    # Hacemos la solicitud GET a /api/productos
    res = client.get("/api/productos")

    # Verificamos que el estado de la respuesta sea 200 OK
    assert res.status_code == 200

    # Verificamos que la respuesta sea una lista
    data = res.get_json()
    assert isinstance(data, list)
    assert len(data) > 0

    # Verificamos que los productos tengan los campos esperados
    assert "nombre" in data[0]
    assert "precio" in data[0]
    assert "stock" in data[0]

def test_get_producto_inexistente(client, mocker):
    """
    Testea que si no existe el producto devuelva 404.
    """
    # Mockeamos `abrirConexion` de nuevo para la consulta del producto
    mocker.patch("app.abrirConexion", return_value=FakeConn())

    # Simulamos un producto inexistente con un id 999
    res = client.get("/api/productos/999")
    assert res.status_code in (404, 400)  # Si el producto no existe, debe devolver 404
