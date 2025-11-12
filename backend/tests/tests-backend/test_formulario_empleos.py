import pytest
import time
from app import app, abrirConexion, cerrarConexion


def _unique_id():
    return str(int(time.time() * 1000))


def test_crear_solicitud_empleo_ok(client):
    payload = {
        'nombre': f'TestNombre_{_unique_id()}',
        'apellido': 'ApellidoTest',
        'email': f'test_solicitud_{_unique_id()}@test.com',
        'telefono': '1138572025',
        'puesto_deseado': 'Repartidor',
        'experiencia': '3 años',
        'mensaje': 'Me interesa trabajar con ustedes',
        'cv_url': 'https://example.com/cv.pdf'
    }

    res = client.post('/api/solicitudes-empleo', json=payload)
    assert res.status_code == 201
    data = res.get_json()
    assert 'message' in data and 'Solicitud' in data['message']
    assert 'id' in data

    # Verificar que la fila fue insertada en la BD
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM solicitudes_empleo WHERE id = %s", (data['id'],))
    row = cursor.fetchone()
    cerrarConexion(conexion)

    assert row is not None
    assert row['nombre'] == payload['nombre']
    assert row['apellido'] == payload['apellido']
    assert row['email'] == payload['email']


def test_crear_solicitud_empleo_campos_requeridos(client):
    # faltar nombre
    payload = {
        'apellido': 'ApellidoTest',
        'email': 'sin_nombre@test.com'
    }
    res = client.post('/api/solicitudes-empleo', json=payload)
    assert res.status_code == 400
    data = res.get_json()
    assert 'error' in data


def test_crear_solicitud_empleo_email_repetido_behaviour(client):
    # Intentar enviar dos solicitudes con mismo email debe crear dos filas distintas
    email = f'dupe_email_{_unique_id()}@test.com'
    payload1 = {'nombre': 'A', 'apellido': 'B', 'email': email}
    payload2 = {'nombre': 'C', 'apellido': 'D', 'email': email}

    r1 = client.post('/api/solicitudes-empleo', json=payload1)
    assert r1.status_code == 201
    id1 = r1.get_json().get('id')

    r2 = client.post('/api/solicitudes-empleo', json=payload2)
    assert r2.status_code == 201
    id2 = r2.get_json().get('id')

    assert id1 != id2

    # Limpiar filas creadas
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("DELETE FROM solicitudes_empleo WHERE id IN (%s, %s)", (id1, id2))
    conexion.commit()
    cerrarConexion(conexion)
