from flask import Flask, url_for, render_template, request, jsonify
import mysql.connector  # Cambia sqlite3 por mysql.connector

app = Flask(__name__)

db = None

def abrirConexion():
    global db
    db = mysql.connector.connect(
        host="10.9.120.5",
        port=3306,
        user="heladeria",         # Cambia por tu usuario MySQL
        password="papus1234",  # Cambia por tu contraseña MySQL
        database="heladeria_papus"
    )
    return db

def cerrarConexion():
    global db
    if db is not None:
        db.close()
        db = None

@app.route("/mysql/test")
def test_mysql():
    global db
    conexion = abrirConexion()
    cursor = conexion.cursor(dictionary=True)
    cursor.execute('SELECT * FROM bocadillos')
    resultado = cursor.fetchall()
    cerrarConexion()
    return jsonify(resultado)