import json
import pytest


# Orden Válida
def test_create_order_success(client):

    payload = {'total': '10.00', 'currency': 'USD'}
    resp = client.post('/api/create-order', json=payload)
    
    assert resp.status_code == 200

    data = resp.get_json()
    assert 'order_id' in data
    assert data['total'] == payload['total']
    assert data['currency'] == payload['currency']

# Sin Total
def test_create_order_missing_total(client):
    payload = {'currency': 'USD'}
    resp = client.post('/api/create-order', json=payload)

    assert resp.status_code == 400
    data = resp.get_json()
    
    assert 'error' in data
    assert data['error'] == 'Missing total'

# Sin Plata
def test_create_order_invalid_currency(client):
    payload = {'total': '10.00', 'currency': 'XYZ'}
    resp = client.post('/api/create-order', json=payload)
    
    assert resp.status_code == 422  
    data = resp.get_json()
    
    assert 'error' in data
    assert data['error'] == 'Invalid currency'
