from flask import Flask, url_for, render_template, request, jsonify

import pymysql, os

from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

from werkzeug.security import generate_password_hash, check_password_hash

from dotenv import load_dotenv

from flask_cors import CORS

from functools import wraps

load_dotenv(".env/development.env")

app = Flask(__name__)

db = None

#                          #
# Clave secreta de la API. #
#                          #
app.secret_key = os.getenv("SECRET_KEY")

app.config.update(
    SESSION_COOKIE_SAMESITE="None",
    SESSION_COOKIE_SECURE=False  # solo desarrollo
)

#              #
# CORS Cookie. #
#              #

CORS(app,resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)


#                                           #
# RUTAS DE PRUEBA Y CONEXIÓN DB EN LA NUBE. #
#                                           #


# Abrir la conexión a la base de datos
def abrirConexion():
    global db
    if db is None or not db.open:
        
        port = int(os.getenv("DB_PORT", 3306))

        db = pymysql.connect(
            host=os.getenv("DB_HOST"),
            port=port,
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME"),
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


#                                                #
# DECORADOR (SEGURIDAD DE RUTAS [LOGIN Y ROLES]) #
#                                                #


def roles_required(*allowed_roles):
    def wrapper(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            if not current_user.is_authenticated:
                return jsonify({"error": "No autenticado"}), 401
            if current_user.rol not in allowed_roles:
                return jsonify({"error": "Acceso denegado"}), 403
            return f(*args, **kwargs)
        return wrapped
    return wrapper


#                           #
# MANEJO DEL LOGIN - CLASES #
#                           #

class User(UserMixin):
    def __init__(self, id, nombre, password_hash, rol='user'):
        self.id = str(id)
        self.nombre = nombre
        self.password_hash = password_hash
        self.rol = rol

    @staticmethod
    def get(user_id):
        conexion = abrirConexion()
        cursor = conexion.cursor()
        cursor.execute("SELECT * FROM usuarios WHERE id = %s", (user_id,))
        result = cursor.fetchone()
        cerrarConexion()
        if result:
            return User(result['id'], result['nombre'], result['password'], result.get('rol', 'user'))
        return None

    @staticmethod
    def get_by_nombre(nombre):
        conexion = abrirConexion()
        cursor = conexion.cursor()
        cursor.execute("SELECT * FROM usuarios WHERE nombre = %s", (nombre,))
        result = cursor.fetchone()
        cerrarConexion()
        if result:
            return User(result['id'], result['nombre'], result['password'], result.get('rol', 'user'))
        return None


#                                           #
# RUTAS DE AUTENTICACIÓN, REGISTRO Y LOGIN. #
#                                           #


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
    
    print("Usuario buscado:", nombre)
    user = User.get_by_nombre(nombre)
    print("Usuario encontrado:", user)

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
@roles_required('usuario')
def protected():
    return jsonify({'message': f'Hola {current_user.nombre}, estás logueado'})

#                             #
# FLASK LOGIN - CONFIGURACIÓN #
#                             #

login_manager = LoginManager()
login_manager.init_app(app)

login_manager.login_view = None  
login_manager.login_message = None  

@login_manager.user_loader
def load_user(user_id):
    return User.get(user_id)





