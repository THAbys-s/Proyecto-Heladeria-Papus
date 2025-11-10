import pytest
from app import app
from flask import session

def test_login_exitoso(client):
    """Prueba un login exitoso con credenciales válidas"""
    response = client.post('/api/login', json={
        'email': 'admin@admin.com',
        'password': 'admin123'
    })
    assert response.status_code == 200
    data = response.get_json()
    assert 'mensaje' in data
    assert data['mensaje'] == 'Login exitoso'
    assert 'user' in data
    assert data['user']['email'] == 'admin@admin.com'
    assert data['user']['rol'] == 'admin'

def test_login_password_incorrecto(client):
    """Prueba login con contraseña incorrecta"""
    response = client.post('/api/login', json={
        'email': 'admin@admin.com',
        'password': 'contraseñaincorrecta'
    })
    assert response.status_code == 401
    data = response.get_json()
    assert 'error' in data
    assert 'contraseña' in data['error'].lower()

def test_login_email_no_existe(client):
    """Prueba login con email que no existe"""
    response = client.post('/api/login', json={
        'email': 'noexiste@test.com',
        'password': 'cualquiera'
    })
    assert response.status_code == 404
    data = response.get_json()
    assert 'error' in data
    assert 'no existe' in data['error'].lower()

def test_login_campos_vacios(client):
    """Prueba login con campos vacíos"""
    # Email vacío
    response = client.post('/api/login', json={
        'email': '',
        'password': 'admin123'
    })
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert 'email' in data['error'].lower()

    # Password vacío
    response = client.post('/api/login', json={
        'email': 'admin@admin.com',
        'password': ''
    })
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert 'contraseña' in data['error'].lower()

def test_logout(client):
    """Prueba el logout de un usuario"""
    # Primero hacemos login
    client.post('/api/login', json={
        'email': 'admin@admin.com',
        'password': 'admin123'
    })

    # Luego logout
    response = client.post('/api/logout')
    assert response.status_code == 200
    data = response.get_json()
    assert 'mensaje' in data
    assert 'cerrada' in data['mensaje'].lower()

def test_ruta_protegida(client):
    """Prueba acceso a ruta protegida con y sin login"""
    # Sin login
    response = client.get('/api/protected')
    assert response.status_code == 401

    # Con login
    client.post('/api/login', json={
        'email': 'admin@admin.com',
        'password': 'admin123'
    })
    response = client.get('/api/protected')
    assert response.status_code == 200

def test_mantener_sesion(client):
    """Prueba que la sesión se mantiene entre requests"""
    # Login inicial
    client.post('/api/login', json={
        'email': 'admin@admin.com',
        'password': 'admin123'
    })

    # Verificar que la sesión persiste en requests subsecuentes
    response = client.get('/api/protected')
    assert response.status_code == 200

def test_multiple_login_mismo_usuario(client):
    """Prueba múltiples logins del mismo usuario"""
    # Primer login
    response1 = client.post('/api/login', json={
        'email': 'admin@admin.com',
        'password': 'admin123'
    })
    assert response1.status_code == 200

    # Segundo login (debería funcionar y actualizar la sesión)
    response2 = client.post('/api/login', json={
        'email': 'admin@admin.com',
        'password': 'admin123'
    })
    assert response2.status_code == 200
