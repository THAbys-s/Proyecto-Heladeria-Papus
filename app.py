from flask import Flask, url_for, render_template, request, jsonify

import pymysql

from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)

db = None

#
# RUTAS DE PRUEBA Y CONEXIÓN DB EN LA NUBE.
#


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


#
# MANEJO DEL LOGIN - CLASES
#

class User(UserMixin):
    def __init__(self, id, nombre, password_hash):
        self.id = id
        self.nombre = nombre
        self.password_hash = password_hash

    @staticmethod
    def get(user_id):
        conexion = abrirConexion()
        cursor = conexion.cursor()
        cursor.execute("SELECT * FROM usuarios WHERE id = %s", (user_id,))
        result = cursor.fetchone()
        cerrarConexion()
        if result:
            return User(result['id'], result['nombre'], result['password'])
        return None

    @staticmethod
    def get_by_nombre(nombre):
        conexion = abrirConexion()
        cursor = conexion.cursor()
        cursor.execute("SELECT * FROM usuarios WHERE nombre = %s", (nombre,))
        result = cursor.fetchone()
        cerrarConexion()
        if result:
            return User(result['id'], result['nombre'], result['password'])
        return None


#
# RUTAS DE AUTENTICACIÓN, REGISTRO Y LOGIN.
#


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    nombre = data['nombre']
    password = data['password']
    email = data['email']

    if User.get_by_nombre(nombre):
        return jsonify({'error': 'Usuario ya existe'}), 400

    password_hash = generate_password_hash(password)
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("INSERT INTO usuarios (nombre, email, password) VALUES (%s, %s, %s)", (nombre, email, password_hash))
    conexion.commit()
    cerrarConexion()
    return jsonify({'message': 'Usuario creado'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    nombre = data['nombre']
    password = data['password']

    user = User.get_by_nombre(nombre)
    if user and check_password_hash(user.password_hash, password):
        login_user(user)
        return jsonify({'message': 'Logged in'}), 200
    return jsonify({'error': 'Credenciales inválidas'}), 401

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out'}), 200

@app.route('/api/protected')
@login_required
def protected():
    return jsonify({'message': f'Hola {current_user.nombre}, estás logueado'})


#
# FLASK LOGIN - CONFIGURACIÓN
#

login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)
