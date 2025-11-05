# test_bocadillos.py
import app
def test_get_bocadillos_ok(client, mocker):
    res = client.get("/api/bocadillos")
    assert res.status_code == 200
    data = res.get_json()
    assert data[0] == "Obleas"
