import pytest
from app import app

def test_agregar_al_carrito(client):
    """Prueba agregar productos al carrito"""
    # Primero agregamos un producto
    response = client.post('/api/carrito/agregar', json={
        'producto_id': 1,
        'cantidad': 2,
        'precio': 15.00,
        'nombre': 'Sundae Frutal'
    })
    assert response.status_code == 200
    data = response.get_json()
    assert 'mensaje' in data
    assert data['mensaje'] == 'Producto agregado al carrito'

    # Verificamos que el producto esté en el carrito
    response = client.get('/api/carrito')
    assert response.status_code == 200
    carrito = response.get_json()
    assert len(carrito) == 1
    assert carrito[0]['producto_id'] == 1
    assert carrito[0]['cantidad'] == 2
    assert carrito[0]['precio'] == 15.00

def test_actualizar_cantidad_carrito(client):
    """Prueba actualizar la cantidad de un producto en el carrito"""
    # Primero agregamos un producto
    client.post('/api/carrito/agregar', json={
        'producto_id': 1,
        'cantidad': 1,
        'precio': 15.00,
        'nombre': 'Sundae Frutal'
    })

    # Actualizamos la cantidad
    response = client.put('/api/carrito/actualizar/1', json={'cantidad': 3})
    assert response.status_code == 200
    
    # Verificamos la actualización
    response = client.get('/api/carrito')
    carrito = response.get_json()
    assert carrito[0]['cantidad'] == 3

def test_eliminar_del_carrito(client):
    """Prueba eliminar un producto del carrito"""
    # Agregamos un producto
    client.post('/api/carrito/agregar', json={
        'producto_id': 1,
        'cantidad': 1,
        'precio': 15.00,
        'nombre': 'Sundae Frutal'
    })

    # Eliminamos el producto
    response = client.delete('/api/carrito/eliminar/1')
    assert response.status_code == 200

    # Verificamos que el carrito esté vacío
    response = client.get('/api/carrito')
    carrito = response.get_json()
    assert len(carrito) == 0

def test_limite_cantidad_producto(client):
    """Prueba que no se puede agregar más del límite permitido de un producto"""
    # Intentamos agregar una cantidad excesiva
    response = client.post('/api/carrito/agregar', json={
        'producto_id': 1,
        'cantidad': 11,  # Asumimos que el límite es 10
        'precio': 15.00,
        'nombre': 'Sundae Frutal'
    })
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert 'límite' in data['error'].lower()

def test_total_carrito(client):
    """Prueba el cálculo del total del carrito"""
    # Agregamos varios productos
    productos = [
        {'producto_id': 1, 'cantidad': 2, 'precio': 15.00, 'nombre': 'Sundae Frutal'},
        {'producto_id': 2, 'cantidad': 1, 'precio': 20.00, 'nombre': 'Crujido Tentador'}
    ]
    
    for producto in productos:
        client.post('/api/carrito/agregar', json=producto)

    # Verificamos el total
    response = client.get('/api/carrito/total')
    assert response.status_code == 200
    data = response.get_json()
    assert data['total'] == 50.00  # (2 * 15.00) + (1 * 20.00)

def test_vaciar_carrito(client):
    """Prueba vaciar todo el carrito"""
    # Agregamos productos
    productos = [
        {'producto_id': 1, 'cantidad': 2, 'precio': 15.00, 'nombre': 'Sundae Frutal'},
        {'producto_id': 2, 'cantidad': 1, 'precio': 20.00, 'nombre': 'Crujido Tentador'}
    ]
    
    for producto in productos:
        client.post('/api/carrito/agregar', json=producto)

    # Vaciamos el carrito
    response = client.delete('/api/carrito/vaciar')
    assert response.status_code == 200

    # Verificamos que esté vacío
    response = client.get('/api/carrito')
    carrito = response.get_json()
    assert len(carrito) == 0

def test_persistencia_carrito(client):
    """Prueba que el carrito persiste entre sesiones"""
    # Agregamos un producto
    client.post('/api/carrito/agregar', json={
        'producto_id': 1,
        'cantidad': 2,
        'precio': 15.00,
        'nombre': 'Sundae Frutal'
    })

    # Simulamos cerrar y abrir una nueva sesión
    client.cookie_jar.clear()

    # Verificamos que el carrito persiste
    response = client.get('/api/carrito')
    assert response.status_code == 200
    carrito = response.get_json()
    assert len(carrito) == 1
    assert carrito[0]['producto_id'] == 1
