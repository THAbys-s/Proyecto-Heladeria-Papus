import json
import pytest

# test_create_order.py

def test_create_order_success(client):
    # request válido
    payload = {'total': '10.00', 'currency': 'USD'}
    resp = client.post('/api/create-order', json=payload)
    
    # verificamos status code
    assert resp.status_code == 200

    # verificamos respuesta JSON
    data = resp.get_json()
    assert 'order_id' in data
    assert data['total'] == payload['total']
    assert data['currency'] == payload['currency']


def test_create_order_missing_total(client):
    # falta campo total
    payload = {'currency': 'USD'}
    resp = client.post('/api/create-order', json=payload)

    assert resp.status_code == 400  # Bad Request
    data = resp.get_json()
    assert 'error' in data
    assert data['error'] == 'Missing total'


def test_create_order_invalid_currency(client):
    # moneda inválida
    payload = {'total': '10.00', 'currency': 'XYZ'}
    resp = client.post('/api/create-order', json=payload)

    assert resp.status_code == 422  # Unprocessable Entity
    data = resp.get_json()
    assert 'error' in data
    assert data['error'] == 'Invalid currency'
