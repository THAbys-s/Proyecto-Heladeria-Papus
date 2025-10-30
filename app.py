from flask import Flask, url_for, render_template, request, jsonify

import pymysql, os

from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user

from werkzeug.security import generate_password_hash, check_password_hash

from dotenv import load_dotenv

from flask_cors import CORS

from functools import wraps

import requests

load_dotenv(".env/development.env")


PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
PAYPAL_API_BASE = os.getenv("PAYPAL_API_BASE", "https://api-m.sandbox.paypal.com")


app = Flask(__name__)

app.secret_key = os.getenv("SECRET_KEY")



#                          #
# Clave secreta de la API. #
#                          #

app.config.update(
    SECRET_KEY=os.getenv("SECRET_KEY"),
    SESSION_COOKIE_HTTPONLY=True,
    REMEMBER_COOKIE_HTTPONLY=True,
    SESSION_PROTECTION="strong",
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=False
)




#              #
# CORS Cookie. #
#              #

CORS(app,resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}}, supports_credentials=True)


#                                           #
# RUTAS DE PRUEBA Y CONEXIÓN DB EN LA NUBE. #
#                                           #


#                                           #
#                Paypal                     #
#                                           #
@app.route('/api/create-order', methods=['POST'])
def create_order():
    data = request.get_json()
    total = data.get('total', '10.00')  # valor por defecto
    currency = data.get('currency', 'USD')

    # Obtener token de acceso PayPal
    auth = (PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET)
    token_response = requests.post(f"{PAYPAL_API_BASE}/v1/oauth2/token",
                                   auth=auth,
                                   data={"grant_type": "client_credentials"})
    token = token_response.json()['access_token']

    # Crear orden
    order_response = requests.post(
        f"{PAYPAL_API_BASE}/v2/checkout/orders",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        },
        json={
            "intent": "CAPTURE",
            "purchase_units": [{
                "amount": {
                    "currency_code": currency,
                    "value": total
                }
            }]
        }
    )

    return jsonify(order_response.json())



@app.route('/api/capture-order/<order_id>', methods=['POST'])
def capture_order(order_id):
    auth = (PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET)
    token_response = requests.post(f"{PAYPAL_API_BASE}/v1/oauth2/token",
                                   auth=auth,
                                   data={"grant_type": "client_credentials"})
    token = token_response.json()['access_token']

    capture_response = requests.post(
        f"{PAYPAL_API_BASE}/v2/checkout/orders/{order_id}/capture",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        }
    )

    return jsonify(capture_response.json())


@app.route('/api/paypal-client-id', methods=['GET'])
def paypal_client_id():
    """Devuelve el client id de PayPal (público) para que el frontend pueda inicializar el SDK.

    Nota: el client id no es sensible y puede exponerse al cliente. Las credenciales secretas
    (client secret) deben permanecer en el servidor.
    """
    return jsonify({"clientId": PAYPAL_CLIENT_ID or ""})





# Abrir la conexión a la base de datos
def abrirConexion():
    """Create and return a new DB connection for each caller.

    Avoid sharing a global connection across requests because Flask may
    serve requests concurrently which can lead to one request closing
    the socket while another is reading from it (ValueError: read of closed file).
    """
    port = int(os.getenv("DB_PORT", 3306))
    conexion = pymysql.connect(
        host=os.getenv("DB_HOST"),
        port=port,
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        cursorclass=pymysql.cursors.DictCursor,
    )
    return conexion

# Cerrar la conexión
def cerrarConexion(conexion):
    """Close the provided DB connection if it's open.

    This function accepts the connection returned by `abrirConexion()` and
    closes it. It intentionally does not manage a global connection.
    """
    try:
        if conexion:
            # Some pymysql versions expose an `open` attribute; double-check
            if hasattr(conexion, "open"):
                if conexion.open:
                    conexion.close()
            else:
                conexion.close()
    except Exception:
        # Don't let closing errors crash the endpoint
        pass

# @app.route("/mysql/test")
# def test_mysql():
#     conexion = abrirConexion()
#     cursor = conexion.cursor()
#     cursor.execute('SELECT * FROM bocadillos')
#     resultado = cursor.fetchall()
#     cerrarConexion()
#     return jsonify(resultado)

# @app.route('/mysql/buscar/sabores')
# def buscar_sabores():
#     conexion = abrirConexion()
#     cursor = conexion.cursor()
#     cursor.execute("SELECT nombre_sabor FROM sabores")
#     res = cursor.fetchall()
#     cerrarConexion()

#     # Verificar la estructura de la respuesta antes de devolverla
#     print("Sabores:", res)
#     return jsonify(res)

# @app.route('/mysql/buscar')
# def buscar_usuario():
#     nombre = request.args.get('nombre', '')
#     conexion = abrirConexion()
#     cursor = conexion.cursor()
#     cursor.execute("SELECT nombre_sabor FROM sabores WHERE nombre_sabor LIKE %s", (f"%{nombre}%",))
#     res = cursor.fetchall()
#     cerrarConexion()

#     # Verificar la estructura de la respuesta antes de devolverla
#     print("Resultado búsqueda:", res)
#     return jsonify(res)

# if __name__ == "__main__":
#     app.run(debug=True)



#                            #
# RUTAS ESPECIALES DE LA API #
#                            #

@app.route('/api/sabores', methods=['GET'])
def obtener_sabores():
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT nombre_sabor FROM sabores")
    res = cursor.fetchall()
    cerrarConexion(conexion)
    nombres = [row['nombre_sabor'] for row in res]
    return jsonify(nombres)


# --- NUEVA RUTA: devolver tiendas (sucursales) ---
@app.route('/api/tiendas', methods=['GET'])
def obtener_tiendas():
    """Devuelve todas las tiendas (tienda_id y direccion)."""
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT tienda_id, direccion FROM tiendas")
    res = cursor.fetchall()
    cerrarConexion(conexion)
    return jsonify(res)


# Empleados por tienda
@app.route('/api/tiendas/<int:tienda_id>/empleados', methods=['GET'])
def obtener_empleados_por_tienda(tienda_id):
    """Devuelve los empleados (nombre, apellido) que trabajan en la tienda indicada."""
    conexion = abrirConexion()
    cursor = conexion.cursor()
    # Se asume que existe una tabla 'empleados' con columnas 'nombre', 'apellido' y 'tienda_id'
    # En la base de datos las columnas reales son nombre_empleado y apellido_empleado
    cursor.execute(
        "SELECT nombre_empleado AS nombre, apellido_empleado AS apellido FROM empleados WHERE tienda_id = %s",
        (tienda_id,)
    )
    res = cursor.fetchall()
    cerrarConexion(conexion)
    return jsonify(res)

# Bocadillos
@app.route('/api/bocadillos', methods=['GET'])
def obtener_bocadillos():
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT nombre_bocadillo FROM bocadillos")
    res = cursor.fetchall()
    cerrarConexion(conexion)
    nombres = [row['nombre_bocadillo'] for row in res]
    return jsonify(nombres)

# Cucuruchos
@app.route('/api/cucuruchos', methods=['GET'])
def obtener_cucuruchos():
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT nombre_cucurucho FROM cucuruchos")
    res = cursor.fetchall()
    cerrarConexion(conexion)
    nombres = [row['nombre_cucurucho'] for row in res]
    return jsonify(nombres)

# Salsas
@app.route('/api/salsas', methods=['GET'])
def obtener_salsas():
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT nombre_salsa FROM salsas")
    res = cursor.fetchall()
    cerrarConexion(conexion)
    nombres = [row['nombre_salsa'] for row in res]
    return jsonify(nombres)

# Sabores Especiales
@app.route('/api/especiales', methods=['GET'])
def obtener_especiales():
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT nombre_especial FROM especiales")
    res = cursor.fetchall()
    cerrarConexion(conexion)
    nombres = [row['nombre_especial'] for row in res]
    return jsonify(nombres)



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
    def __init__(self, id, nombre, password_hash, rol='usuario'):
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
        cerrarConexion(conexion)
        if result:
            return User(
                result['id'],
                result['nombre'],
                result['password'],
                result.get('access', 'usuario')
            )
        return None

    @staticmethod
    def get_by_nombre(nombre):
        conexion = abrirConexion()
        cursor = conexion.cursor()
        cursor.execute("SELECT * FROM usuarios WHERE nombre = %s", (nombre,))
        result = cursor.fetchone()
        cerrarConexion(conexion)
        if result:
            return User(
                result['id'],
                result['nombre'],
                result['password'],
                result.get('access', 'usuario')  
            )
        return None


#                     #
# URL DE LAS IMAGENES #
#                     #

img_urls = {
    "Crujido Tentador": "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933010/bombon-crocante_pjggzf.jpg",
    "Boscado Celestial": "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933010/bombon-escoces_etximj.jpg",
    "Dulce Suspiro": "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933010/bombon-split_jzocao.jpg",
    "Duo Delicia": "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933010/bombon-suizo_uajm0g.jpg",
    "Vainilla Sueño": "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933010/capelinas-chocolate_dvqf1s.jpg",
    "Frescura Tropical": "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933010/capelinas-frutal_ecktij.jpg",
    "Frutilla Encantada": "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933012/capelinas-frutilla_e4xxhj.jpg",
    "Chocolate Divino": "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933019/capelinas-nuez_nkkhlx.jpg",
    "Palito Bombón": "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933019/palito-bombon_x3wdc7.jpg",
    "Palito Vainillita": "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933019/palitocremoso-americana_ncrz23.jpg",
    "Palito Rosado": "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933019/palitocremoso-frutilla_bkwwo7.jpg",
    "Crujido Almendrado": "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933028/postres-almendrado_nmfxwe.jpg",
    "Trio Tentador": "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933028/postres-cassata_n4nmcp.jpg",
    "Sueño Chocolatoso": "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933028/postres-crocantino_ewicb2.jpg",
    "Beso De Amor": "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933028/postres-delicia_lsyjoo.jpg",
    "Sundae Frutal": "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933028/sundae-frutal_fgxdi3.jpg",
    "Sundae Go": "https://res.cloudinary.com/dwwzeq55r/image/upload/v1759933035/sundae-go_zhnr5w.jpg"
}


#                                           #
# RUTAS DE AUTENTICACIÓN, REGISTRO Y LOGIN. #
#                                           #


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    nombre = data['nombre']
    password = data['password']
    email = data['email']
    rol = data.get('rol', 'usuario') 

    if User.get_by_nombre(nombre):
        return jsonify({'error': 'Usuario ya existe'}), 400

    password_hash = generate_password_hash(password)
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute(
        "INSERT INTO usuarios (nombre, email, password, access) VALUES (%s, %s, %s, %s)",
        (nombre, email, password_hash, rol)
    )
    conexion.commit()
    cerrarConexion(conexion)
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
        login_user(user, remember=True)
        return jsonify({'message': 'Logged in'}), 200
    return jsonify({'error': 'Credenciales inválidas'}), 401

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out'}), 200

@app.route('/api/protected')
@login_required
@roles_required('admin')
def protected():
    return jsonify({'message': f'Hola {current_user.nombre}, estás logueado'})

@app.route('/api/productos', methods=['GET'])
def api_productos():
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT id, nombre, precio, precioOriginal, descuento FROM productos")
    productos = cursor.fetchall()
    cerrarConexion(conexion)

    for producto in productos:
        producto['img'] = img_urls.get(producto['nombre'], '')

    return jsonify(productos)


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






