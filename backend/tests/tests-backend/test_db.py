from app import abrirConexion, cerrarConexion


def test_db_connection_simple():
    """Verifica que se puede abrir una conexión y ejecutar una consulta simple."""
    conexion = abrirConexion()
    try:
        cursor = conexion.cursor()
        cursor.execute("SELECT 1 AS ok")
        res = cursor.fetchone()
        assert res is not None
        assert res.get('ok') == 1 or res.get('ok') == '1'

        # Intentar leer el número de filas de solicitudes_empleo (si existe la tabla)
        try:
            cursor.execute("SELECT COUNT(*) AS cnt FROM solicitudes_empleo")
            c = cursor.fetchone()
            assert c is not None
            assert 'cnt' in c
        except Exception:
            # Si la tabla no existe, no fallar el test de conexión
            pass
    finally:
        cerrarConexion(conexion)
