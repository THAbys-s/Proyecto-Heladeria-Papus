import app


def test_get_usuarios_ok(client):
    res = client.get("/api/usuarios")
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data, list)
    # Si hay usuarios en la BD, comprobamos que la estructura tiene keys esperadas
    if len(data) > 0:
        assert 'id' in data[0]
        assert 'nombre' in data[0]
        assert 'email' in data[0]
