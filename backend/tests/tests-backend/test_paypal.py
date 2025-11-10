import pytest
from app import app

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

def test_capture_order(client):
    # Primero se crea una orden real
    create_response = client.post('/api/create-order', json={'total': '10.00', 'currency': 'USD'})
    assert create_response.status_code == 200
    order_data = create_response.get_json()
    order_id = order_data.get('id')
    assert order_id is not None

    # Intentamos capturar la orden (esto DEBE fallar)
    capture_response = client.post(f'/api/capture-order/{order_id}')
    capture_data = capture_response.get_json()

    # Verificamos que la respuesta contenga el error de PayPal
    assert 'name' in capture_data
    assert capture_data['name'] == 'UNPROCESSABLE_ENTITY'

    # 2. Verificamos que el cuerpo del error contenga los detalles
    assert 'details' in capture_data
    assert 'message' in capture_data
    
    # 3. Verificamos la RAZÓN del error.
    # 'ORDER_NOT_APPROVED' es casi seguro un 'issue', no parte de la 'description'.
    details = capture_data.get('details', [])
    assert len(details) > 0  # Nos aseguramos de que haya al menos un detalle

    # Comprobamos el 'issue' (la causa raíz)
    assert any(d.get('issue') == 'ORDER_NOT_APPROVED' for d in details)
    
    # Opcionalmente, también puedes comprobar la descripción legible
    description_text = details[0].get('description', '').lower()
    assert 'not yet approved' in description_text

def test_paypal_client_id(client):
    response = client.get('/api/paypal-client-id')
    assert response.status_code == 200
    data = response.get_json()
    assert 'clientId' in data
    assert data['clientId'] != ''
