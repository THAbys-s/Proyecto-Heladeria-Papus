import pytest
from app import app

def test_agregar_comentario(client):
    """Prueba agregar un comentario a un producto"""
    # Login necesario para comentar
    client.post('/api/login', json={
        'email': 'test@test.com',
        'password': 'test123'
    })

    # Agregamos un comentario
    response = client.post('/api/comentarios/1', json={
        'comentario': 'El mejor helado que he probado!'
    })
    assert response.status_code == 200
    data = response.get_json()
    assert 'message' in data
    assert data['message'] == 'Comentario agregado correctamente'

def test_obtener_comentarios(client):
    """Prueba obtener todos los comentarios de un producto"""
    response = client.get('/api/comentarios/1')
    assert response.status_code == 200
    comentarios = response.get_json()
    assert isinstance(comentarios, list)
    
    if len(comentarios) > 0:
        assert 'id' in comentarios[0]
        assert 'comentario' in comentarios[0]
        assert 'fecha' in comentarios[0]
        assert 'usuario' in comentarios[0]

def test_comentario_vacio(client):
    """Prueba que no se puede agregar un comentario vacío"""
    # Login
    client.post('/api/login', json={
        'email': 'test@test.com',
        'password': 'test123'
    })

    # Intentar agregar comentario vacío
    response = client.post('/api/comentarios/1', json={
        'comentario': ''
    })
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert data['error'] == 'Comentario vacío'

def test_comentario_sin_login(client):
    """Prueba que no se puede comentar sin estar logueado"""
    response = client.post('/api/comentarios/1', json={
        'comentario': 'Este comentario no debería guardarse'
    })
    assert response.status_code == 401  # Unauthorized

def test_comentario_producto_inexistente(client):
    """Prueba comentar en un producto que no existe"""
    # Login
    client.post('/api/login', json={
        'email': 'test@test.com',
        'password': 'test123'
    })

    # Intentar comentar en producto inexistente
    response = client.post('/api/comentarios/99999', json={
        'comentario': 'Este producto no existe'
    })
    assert response.status_code == 404
    data = response.get_json()
    assert 'error' in data
    assert 'no existe' in data['error'].lower()

def test_formato_fecha_comentario(client):
    """Prueba que la fecha del comentario tiene el formato correcto"""
    response = client.get('/api/comentarios/1')
    assert response.status_code == 200
    comentarios = response.get_json()
    
    if len(comentarios) > 0:
        from datetime import datetime
        fecha_str = comentarios[0]['fecha']
        try:
            datetime.strptime(fecha_str, '%Y-%m-%d %H:%M:%S')
            assert True
        except ValueError:
            assert False, "Formato de fecha incorrecto"

def test_orden_comentarios(client):
    """Prueba que los comentarios se muestran en orden correcto (más recientes primero)"""
    # Agregar varios comentarios
    client.post('/api/login', json={
        'email': 'test@test.com',
        'password': 'test123'
    })

    comentarios = [
        'Primer comentario',
        'Segundo comentario',
        'Tercer comentario'
    ]

    for comentario in comentarios:
        client.post('/api/comentarios/1', json={'comentario': comentario})

    # Verificar orden
    response = client.get('/api/comentarios/1')
    assert response.status_code == 200
    comentarios_recibidos = response.get_json()
    
    # Verificar que están en orden descendente por fecha
    for i in range(len(comentarios_recibidos) - 1):
        fecha1 = datetime.strptime(comentarios_recibidos[i]['fecha'], '%Y-%m-%d %H:%M:%S')
        fecha2 = datetime.strptime(comentarios_recibidos[i+1]['fecha'], '%Y-%m-%d %H:%M:%S')
        assert fecha1 >= fecha2

def test_limite_caracteres_comentario(client):
    """Prueba el límite de caracteres en un comentario"""
    # Login
    client.post('/api/login', json={
        'email': 'test@test.com',
        'password': 'test123'
    })

    # Crear un comentario muy largo (más de 500 caracteres)
    comentario_largo = 'a' * 501

    response = client.post('/api/comentarios/1', json={
        'comentario': comentario_largo
    })
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert 'límite' in data['error'].lower()
