# conftest.py
import pytest
import os
import sys

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from app import app as flask_app

@pytest.fixture(scope="session")
def app():
    """Configura la aplicación Flask para pruebas."""
    flask_app.config.update(TESTING=True, SECRET_KEY="test-secret-key")
    return flask_app

@pytest.fixture()
def client(app):
    """Devuelve un cliente de pruebas de Flask."""
    return app.test_client()
