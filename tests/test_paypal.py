import json


def test_create_order_success(client):
    resp = client.post('/api/create-order', json={'total': '10.00', 'currency': 'USD'})
    assert resp.status_code == 200
