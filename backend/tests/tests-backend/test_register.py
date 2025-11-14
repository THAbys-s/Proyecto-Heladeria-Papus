import pytest
from app import app
from werkzeug.security import check_password_hash

def test_registro_exitoso(client):
    """Prueba un registro exitoso con datos válidos"""
    response = client.post('/api/register', json={
        'nombre': 'Usuario Test',
        'email': f'usuario_test_{pytest.unique_id()}@test.com',
        'password': 'test123',
        'rol': 'usuario'
    })
    assert response.status_code == 201  # Created
    data = response.get_json()
    assert 'mensaje' in data
    assert 'registrado' in data['mensaje'].lower()
    assert 'id' in data

def test_registro_email_duplicado(client):
    """Prueba registro con email que ya existe"""
    # Primer registro
    email = f'duplicado_{pytest.unique_id()}@test.com'
    client.post('/api/register', json={
        'nombre': 'Usuario Original',
        'email': email,
        'password': 'test123',
        'rol': 'usuario'
    })

    # Intento de registro con el mismo email
    response = client.post('/api/register', json={
        'nombre': 'Usuario Duplicado',
        'email': email,
        'password': 'test456',
        'rol': 'usuario'
    })
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert 'existe' in data['error'].lower()

def test_registro_campos_requeridos(client):
    """Prueba registro con campos faltantes"""
    campos_requeridos = ['nombre', 'email', 'password']
    
    for campo in campos_requeridos:
        datos = {
            'nombre': 'Usuario Test',
            'email': 'test@test.com',
            'password': 'test123',
            'rol': 'usuario'
        }
        datos.pop(campo)
        
        response = client.post('/api/register', json=datos)
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert campo in data['error'].lower()

def test_registro_password_segura(client):
    """Prueba requisitos de seguridad de la contraseña"""
    response = client.post('/api/register', json={
        'nombre': 'Usuario Test',
        'email': f'test_{pytest.unique_id()}@test.com',
        'password': '123',  # Contraseña muy corta
        'rol': 'usuario'
    })
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert 'contraseña' in data['error'].lower()

def test_registro_validacion_email(client):
    """Prueba validación del formato de email"""
    emails_invalidos = [
        'notanemail',
        'still@not@anemail',
        '@nocomienzo.com',
        'sinarroba.com',
        'sin.dominio@',
        ' @espacios.com'
    ]

    for email in emails_invalidos:
        response = client.post('/api/register', json={
            'nombre': 'Usuario Test',
            'email': email,
            'password': 'test123',
            'rol': 'usuario'
        })
        assert response.status_code == 400
        data = response.get_json()
        assert 'error' in data
        assert 'email' in data['error'].lower()

def test_registro_y_login(client):
    """Prueba registro seguido de login"""
    # Registro
    email = f'testuser_{pytest.unique_id()}@test.com'
    password = 'test123'
    
    register_response = client.post('/api/register', json={
        'nombre': 'Usuario Test',
        'email': email,
        'password': password,
        'rol': 'usuario'
    })
    assert register_response.status_code == 201

    # Login con las credenciales registradas
    login_response = client.post('/api/login', json={
        'email': email,
        'password': password
    })
    assert login_response.status_code == 200
    data = login_response.get_json()
    assert data['user']['email'] == email

def test_registro_nombre_largo(client):
    """Prueba registro con nombre muy largo"""
    nombre_largo = 'A' * 101  # Más de 100 caracteres
    response = client.post('/api/register', json={
        'nombre': nombre_largo,
        'email': f'test_{pytest.unique_id()}@test.com',
        'password': 'test123',
        'rol': 'usuario'
    })
    assert response.status_code == 400
    data = response.get_json()
    assert 'error' in data
    assert 'nombre' in data['error'].lower()

# Fixture para generar IDs únicos para emails
@pytest.fixture(autouse=True)
def unique_id():
    """Genera un ID único para usar en emails de prueba"""
    import time
    pytest.unique_id = lambda: str(int(time.time() * 1000))
