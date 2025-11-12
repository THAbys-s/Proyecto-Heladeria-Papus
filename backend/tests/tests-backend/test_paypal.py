import os
import time
import pytest
from app import app

try:
    # Local helper that automates PayPal order approval using Playwright
    from paypal_approver import approve_paypal_approve_url
except Exception:
    approve_paypal_approve_url = None


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


def test_create_order(client):
    response = client.post('/api/create-order', json={'total': '10.00', 'currency': 'USD'})
    assert response.status_code == 200
    data = response.get_json()
    assert 'id' in data
    assert data['id'] is not None
    assert 'status' in data
    assert data['status'] == 'CREATED'


# def test_capture_order(client):
#     """Create a real order, automate buyer approval in PayPal sandbox (requires env vars)

#     Requires environment variables:
#       - PAYPAL_TEST_BUYER_EMAIL
#       - PAYPAL_TEST_BUYER_PASSWORD

#     Also requires Playwright to be installed (see README_PAYPAL.md).
#     If the environment is not prepared, this test will be skipped with an informative message.
#     """
#     buyer_email = os.getenv('PAYPAL_TEST_BUYER_EMAIL')
#     buyer_password = os.getenv('PAYPAL_TEST_BUYER_PASSWORD')

#     if not buyer_email or not buyer_password:
#         pytest.skip("Playwright PayPal approval skipped: set PAYPAL_TEST_BUYER_EMAIL and PAYPAL_TEST_BUYER_PASSWORD to enable.")

#     if approve_paypal_approve_url is None:
#         pytest.skip("Playwright helper not available. Install requirements and ensure tests can import the helper.")

#     # 1) Crear orden
#     create_response = client.post('/api/create-order', json={'total': '10.00', 'currency': 'USD'})
#     assert create_response.status_code == 200
#     order_data = create_response.get_json()
#     order_id = order_data.get('id')
#     assert order_id is not None

#     # extraer link de aprobación
#     links = order_data.get('links', []) or []
#     approve_url = None
#     for l in links:
#         if l.get('rel') == 'approve':
#             approve_url = l.get('href')
#             break
#     assert approve_url is not None, "No approve link returned by PayPal create-order"

#     # 2) Abrir navegador automatizado y aprobar la orden (esto inicia sesión con el comprador sandbox)
#     # headless can be controlled via env var for debugging
#     headless_env = os.getenv('PAYPAL_PLAYWRIGHT_HEADLESS', '1')
#     headless = headless_env not in ('0', 'false', 'False')

#     approve_paypal_approve_url(approve_url, buyer_email, buyer_password, headless=headless)

#     # 3) esperar un momento para que PayPal procese la aprobación
#     time.sleep(2)

#     # 4) Capturar la orden ya aprobada
#     capture_response = client.post(f'/api/capture-order/{order_id}')
#     assert capture_response.status_code == 200
#     capture_data = capture_response.get_json()

#     # Ahora la captura debería haberse completado
#     assert 'status' in capture_data
#     assert capture_data['status'] in ('COMPLETED', 'COMPLETED_WITH_INSTRUMENT_DECLINED')


# def test_paypal_client_id(client):
#     response = client.get('/api/paypal-client-id')
#     assert response.status_code == 200
#     data = response.get_json()
#     assert 'clientId' in data
#     assert data['clientId'] != ''
