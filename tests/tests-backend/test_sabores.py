import app

# Definición de FakeConn
class FakeConn:
    def cursor(self):
        return self
    
    def execute(self, query):
        # Simulamos la ejecución de la consulta sin hacer nada
        return self
    
    def fetchall(self):
        # Simulamos los datos de sabores que se devolverían de la base de datos como diccionarios
        return [{"nombre_sabor": "Chocolate"}, {"nombre_sabor": "Vainilla"}]  # Lista de diccionarios
    
    def close(self):
        pass

# Test de sabores
def test_get_sabores_ok(client, mocker):
    """
    ✅ Testea que /api/sabores devuelva una lista de nombres mockeados.
    """
    # Mockeamos la función abrirConexion para que devuelva FakeConn
    mocker.patch.object(app, "abrirConexion", return_value=FakeConn())

    # Realizamos la solicitud GET a /api/sabores
    response = client.get('/api/sabores')

    # Aseguramos que la respuesta sea 200 OK
    assert response.status_code == 200

    # Verificamos que los sabores estén en la respuesta
    data = response.get_json()
    assert isinstance(data, list)
    
    # Accedemos a los sabores como diccionarios (con 'nombre_sabor')
    assert "Chocolate" in [sabor['nombre_sabor'] for sabor in data]
    assert "Vainilla" in [sabor['nombre_sabor'] for sabor in data]
