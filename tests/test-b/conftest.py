import pytest
import importlib
import os
import sys

# Asegurar que la raíz del proyecto (uno arriba de tests/) esté en sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Importar el módulo app (app.py) como módulo para acceder a app y requests
app_module = importlib.import_module('app')


@pytest.fixture
def client():
    app = app_module.app
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


@pytest.fixture
def app_module_fixture():
    # Exponer el módulo para tests que necesiten monkeypatch sobre app.requests
    return app_module
