from flask import Flask, url_for, render_template, request, jsonify
import pymysql

app = Flask(__name__)

db = None

# Abrir la conexión a la base de datos
def abrirConexion():
    global db
    if db is None or db.open == 0:  # Verificar si la conexión ya está cerrada
        db = pymysql.connect(
            host="10.9.120.5",
            port=3306,
            user="heladeria",
            password="papus1234",
            database="heladeria_papus",
            cursorclass=pymysql.cursors.DictCursor
        )
    return db

# Cerrar la conexión
def cerrarConexion():
    global db
    if db is not None:
        db.close()
        db = None  # Marcar la conexión como cerrada

@app.route("/mysql/test")
def test_mysql():
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute('SELECT * FROM bocadillos')
    resultado = cursor.fetchall()
    cerrarConexion()
    return jsonify(resultado)

@app.route('/mysql/buscar/sabores')
def buscar_sabores():
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT nombre_sabor FROM sabores")
    res = cursor.fetchall()
    cerrarConexion()

    # Verificar la estructura de la respuesta antes de devolverla
    print("Sabores:", res)
    return jsonify(res)

@app.route('/mysql/buscar')
def buscar_usuario():
    nombre = request.args.get('nombre', '')
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT nombre_sabor FROM sabores WHERE nombre_sabor LIKE %s", (f"%{nombre}%",))
    res = cursor.fetchall()
    cerrarConexion()

    # Verificar la estructura de la respuesta antes de devolverla
    print("Resultado búsqueda:", res)
    return jsonify(res)

if __name__ == "__main__":
    app.run(debug=True)
