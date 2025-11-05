# test_cucuruchos.py
import app
def test_get_cucuruchos_ok(client):
    res = client.get("/api/cucuruchos")
    assert res.status_code == 200
    data = res.get_json()
    assert data[0] == "Cucurucho Simple" 