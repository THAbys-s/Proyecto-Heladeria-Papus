from flask import Flask, url_for, render_template, request, jsonify
import sqlite3
app = Flask(__name__)

db = None  


def abrirConexion():
    global db  
    db = sqlite3.connect("sql/heladeria_papus.db")  # Es la conexión con la base de datos de SQLite.
    db.row_factory = sqlite3.Row  
    return db  


def cerrarConexion():
    global db  
    if db is not None:  
        db.close()  
        db = None  


# def dict_factory(cursor, row):
#   """Arma un diccionario con los valores de la fila."""
#   fields = [column[0] for column in cursor.description]  
#   return {key: value for key, value in zip(fields, row)}  


@app.route("/sqlite/test")
def test():
    global db
    conexion = abrirConexion()  
    cursor = conexion.cursor()  
    cursor.execute('SELECT * FROM bocadillos')  
    resultado = cursor.fetchall()  
    cerrarConexion()
    fila = [dict(row) for row in resultado]  # Convierte cada fila en un diccionario
    return str(fila)  

@app.route('/sqlite')
def datos_por_nombre():
    return render_template("temp.html")

@app.route('/sqlite/buscar')
def buscar_usuario():
    nombre = request.args.get('nombre', '')
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT nombre_sabor FROM sabores WHERE nombre_sabor LIKE ?", (f"%{nombre}%",))
    res = cursor.fetchall()
    cerrarConexion()
    usuarios = [dict(row) for row in res]
    return jsonify(usuarios)

