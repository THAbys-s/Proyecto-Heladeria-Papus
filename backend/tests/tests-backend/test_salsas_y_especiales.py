# test_salsas_y_especiales.py
import app
def test_get_salsas_ok(client):
    res = client.get("/api/salsas")
    assert res.status_code == 200
    data = res.get_json()
    assert data[0] == "Salsa de Frutilla" 
    
def test_get_especiales_ok(client):
    res = client.get("/api/especiales")
    assert res.status_code == 200
    data = res.get_json()
    assert data[0] == "Tramontana" 