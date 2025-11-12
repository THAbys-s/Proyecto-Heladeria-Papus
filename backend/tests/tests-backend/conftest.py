# conftest.py
import pytest
import os
import sys

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from app import app as flask_app
from app import abrirConexion, cerrarConexion
from werkzeug.security import generate_password_hash
import datetime as _dt
import builtins

@pytest.fixture(scope="session")
def app():
    """Configura la aplicación Flask para pruebas."""
    flask_app.config.update(TESTING=True, SECRET_KEY="test-secret-key")
    return flask_app

@pytest.fixture()
def client(app):
    """Devuelve un cliente de pruebas de Flask."""
    client = app.test_client()

    # Asegurar que exista un cookie_jar.clear() para tests que lo usan
    class _CJ:
        def clear(self):
            # no-op: la persistencia del carrito está en DB, no en cookies
            return None

    client.cookie_jar = _CJ()

    # Limpiar tabla carrito antes de cada test para aislar estado
    try:
        conexion = abrirConexion()
        cursor = conexion.cursor()
        cursor.execute("DELETE FROM carrito")
        conexion.commit()
        # Sembrar usuarios de prueba si no existen
        users = [
            ('admin@admin.com', 'admin123', 'admin', 'Admin User'),
            ('test@test.com', 'test123', 'usuario', 'Test User')
        ]
        for email, pwd, access, nombre in users:
            cursor.execute("SELECT id FROM usuarios WHERE email = %s", (email,))
            if not cursor.fetchone():
                pwd_hash = generate_password_hash(pwd)
                cursor.execute(
                    "INSERT INTO usuarios (nombre, email, password, fecha_creacion, access) VALUES (%s, %s, %s, NOW(), %s)",
                    (nombre, email, pwd_hash, access)
                )
        conexion.commit()
    except Exception:
        pass
    finally:
        try:
            if 'conexion' in locals():
                cerrarConexion(conexion)
        except Exception:
            pass

    # Hacer disponible la clase datetime en builtins para tests que la usan sin importar
    builtins.datetime = _dt.datetime

    return client
