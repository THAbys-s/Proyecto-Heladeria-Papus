# app.py

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
#               COMENTARIOS                 #
#                                           #


@app.route('/api/comentarios/<int:producto_id>', methods=['GET'])
def obtener_comentarios(producto_id):
    """Devuelve todos los comentarios de un producto."""
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("""
        SELECT c.id, c.comentario, c.fecha, u.nombre AS usuario
        FROM comentarios c
        JOIN usuarios u ON c.usuario_id = u.id
        WHERE c.producto_id = %s
        ORDER BY c.fecha DESC
    """, (producto_id,))
    comentarios = cursor.fetchall()
    # Formatear la fecha como cadena para que los tests reciban: 'YYYY-MM-DD HH:MM:SS'
    for c in comentarios:
        f = c.get('fecha')
        try:
            if f is not None:
                c['fecha'] = f.strftime('%Y-%m-%d %H:%M:%S')
        except Exception:
            # si ya es string o no puede formatearse, dejar como está
            pass
    cerrarConexion(conexion)
    return jsonify(comentarios)


@app.route('/api/comentarios/<int:producto_id>', methods=['POST'])
@login_required
def agregar_comentario(producto_id):
    """Agrega un nuevo comentario al producto logueado."""
    data = request.get_json()
    texto = data.get('comentario', '').strip()

    if not texto:
        return jsonify({'error': 'Comentario vacío'}), 400

    if len(texto) > 500:
        return jsonify({'error': 'Se supera el límite de caracteres del comentario'}), 400

    # Verificar que el producto exista
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT id FROM productos WHERE id = %s", (producto_id,))
    prod = cursor.fetchone()
    if not prod:
        cerrarConexion(conexion)
        return jsonify({'error': 'El producto no existe'}), 404

    cursor.execute(
        "INSERT INTO comentarios (producto_id, usuario_id, comentario, fecha) VALUES (%s, %s, %s, NOW())",
        (producto_id, current_user.id, texto)
    )
    conexion.commit()
    cerrarConexion(conexion)

    return jsonify({'message': 'Comentario agregado correctamente'})







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
    print(PAYPAL_CLIENT_ID)
    print(PAYPAL_CLIENT_SECRET)

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
    print(capture_response.json())
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



def cerrarConexion(conexion):
    """Close the provided DB connection if it's open.

    This function accepts the connection returned by `abrirConexion()` and
    closes it. It intentionally does not manage a global connection.
    """
    try:
        if conexion:
            if hasattr(conexion, "open"):
                if conexion.open:
                    conexion.close()
            else:
                conexion.close()
    except Exception:
        pass

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

@app.route('/api/sabores/<int:id>', methods=['GET'])
def obtener_sabor_por_id(id):
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT nombre_sabor FROM sabores WHERE sabor_id = %s", (id,))
    res = cursor.fetchone()
    cerrarConexion(conexion)
    
    if res is None:
        return jsonify({"error": "Sabor no encontrado"}), 404
    
    return jsonify({"id": id, "nombre_sabor": res['nombre_sabor']})



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

    @staticmethod
    def get_by_email(email):
        conexion = abrirConexion()
        cursor = conexion.cursor()
        cursor.execute("SELECT * FROM usuarios WHERE email = %s", (email,))
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
    nombre = data.get('nombre', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()
    rol = data.get('rol', 'usuario')

    if not nombre or not email or not password:
        # Return specific missing field to satisfy tests
        for campo in ['nombre', 'email', 'password']:
            if not locals().get(campo):
                return jsonify({'error': f'Falta {campo}'}), 400

    # Validaciones sencillas
    if len(nombre) > 100:
        return jsonify({'error': 'El nombre es demasiado largo'}), 400

    if len(password) < 6:
        return jsonify({'error': 'La contraseña es muy corta'}), 400

    # Validación básica de email
    if '@' not in email or email.startswith('@') or email.endswith('@'):
        return jsonify({'error': 'Formato de email inválido'}), 400

    # Verificar por email (unico)
    if User.get_by_email(email):
        return jsonify({'error': 'Usuario con ese email ya existe'}), 400

    password_hash = generate_password_hash(password)
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute(
        "INSERT INTO usuarios (nombre, email, password, access) VALUES (%s, %s, %s, %s)",
        (nombre, email, password_hash, rol)
    )
    conexion.commit()
    new_id = cursor.lastrowid
    cerrarConexion(conexion)
    return jsonify({'mensaje': 'Usuario registrado', 'id': new_id}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email', '').strip()
    password = data.get('password', '')

    if not email:
        return jsonify({'error': 'Email requerido'}), 400

    if not password:
        return jsonify({'error': 'Contraseña requerida'}), 400

    user = User.get_by_email(email)

    if not user:
        return jsonify({'error': 'Usuario no existe'}), 404

    if not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Contraseña incorrecta'}), 401

    login_user(user, remember=True)
    return jsonify({'mensaje': 'Login exitoso', 'user': {'email': email, 'rol': user.rol}}), 200

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'mensaje': 'Sesión cerrada'}), 200

@app.route('/api/protected')
@login_required
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

@app.route('/api/productos/<int:id>', methods=['GET'])
def get_producto(id):
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT * FROM productos WHERE id = %s", (id,))
    producto = cursor.fetchone()
    cerrarConexion(conexion)
    
    if producto is None:
        return jsonify({"error": "Producto no encontrado"}), 404

    return jsonify(producto)


# ---------------------
# RUTAS PARA EL CARRITO
# ---------------------


@app.route('/api/carrito/agregar', methods=['POST'])
def carrito_agregar():
    """Agrega un producto al carrito persistente en DB.

    Request JSON: { producto_id, cantidad, precio, nombre }
    """
    data = request.get_json() or {}
    try:
        producto_id = int(data.get('producto_id'))
        cantidad = int(data.get('cantidad', 1))
        precio = float(data.get('precio', 0))
        nombre = data.get('nombre', '')
    except Exception:
        return jsonify({'error': 'Datos inválidos'}), 400

    # Límite por producto (según tests asumimos 10)
    if cantidad > 10:
        return jsonify({'error': 'Se supera el límite de cantidad permitido'}), 400

    conexion = abrirConexion()
    cursor = conexion.cursor()

    # Si ya existe el producto en carrito, sumar cantidades
    cursor.execute("SELECT * FROM carrito WHERE producto_id = %s", (producto_id,))
    existente = cursor.fetchone()
    if existente:
        nueva_cantidad = existente['cantidad'] + cantidad
        if nueva_cantidad > 10:
            cerrarConexion(conexion)
            return jsonify({'error': 'Se supera el límite de cantidad permitido'}), 400
        cursor.execute("UPDATE carrito SET cantidad = %s, precio = %s, nombre = %s WHERE producto_id = %s",
                       (nueva_cantidad, precio, nombre, producto_id))
    else:
        cursor.execute("INSERT INTO carrito (producto_id, cantidad, precio, nombre, fecha) VALUES (%s, %s, %s, %s, NOW())",
                       (producto_id, cantidad, precio, nombre))

    conexion.commit()
    cerrarConexion(conexion)
    return jsonify({'mensaje': 'Producto agregado al carrito'})


@app.route('/api/carrito', methods=['GET'])
def carrito_obtener():
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT id, producto_id, cantidad, precio, nombre, fecha FROM carrito ORDER BY id")
    items = cursor.fetchall()
    cerrarConexion(conexion)
    # Asegurar tipos JSON-friendly (precio como float, fecha como string)
    for it in items:
        if 'precio' in it and it['precio'] is not None:
            try:
                it['precio'] = float(it['precio'])
            except Exception:
                try:
                    it['precio'] = float(str(it['precio']))
                except Exception:
                    pass
        if 'fecha' in it and it['fecha'] is not None:
            try:
                it['fecha'] = it['fecha'].strftime('%Y-%m-%d %H:%M:%S')
            except Exception:
                pass
    return jsonify(items)


@app.route('/api/carrito/actualizar/<int:producto_id>', methods=['PUT'])
def carrito_actualizar(producto_id):
    data = request.get_json() or {}
    try:
        cantidad = int(data.get('cantidad'))
    except Exception:
        return jsonify({'error': 'Cantidad inválida'}), 400

    if cantidad < 0:
        return jsonify({'error': 'Cantidad inválida'}), 400
    if cantidad > 10:
        return jsonify({'error': 'Se supera el límite de cantidad permitido'}), 400

    conexion = abrirConexion()
    cursor = conexion.cursor()
    if cantidad == 0:
        cursor.execute("DELETE FROM carrito WHERE producto_id = %s", (producto_id,))
    else:
        cursor.execute("UPDATE carrito SET cantidad = %s WHERE producto_id = %s", (cantidad, producto_id))
    conexion.commit()
    cerrarConexion(conexion)
    return jsonify({'mensaje': 'Cantidad actualizada'})


@app.route('/api/carrito/eliminar/<int:producto_id>', methods=['DELETE'])
def carrito_eliminar(producto_id):
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("DELETE FROM carrito WHERE producto_id = %s", (producto_id,))
    conexion.commit()
    cerrarConexion(conexion)
    return jsonify({'mensaje': 'Producto eliminado del carrito'})


@app.route('/api/carrito/vaciar', methods=['DELETE'])
def carrito_vaciar():
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("DELETE FROM carrito")
    conexion.commit()
    cerrarConexion(conexion)
    return jsonify({'mensaje': 'Carrito vaciado'})


@app.route('/api/carrito/total', methods=['GET'])
def carrito_total():
    conexion = abrirConexion()
    cursor = conexion.cursor()
    cursor.execute("SELECT SUM(precio * cantidad) AS total FROM carrito")
    res = cursor.fetchone() or {}
    total = float(res.get('total') or 0)
    cerrarConexion(conexion)
    return jsonify({'total': round(total, 2)})






