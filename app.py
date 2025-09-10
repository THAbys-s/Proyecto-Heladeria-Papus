from flask import Flask, jsonify, request
from flask_cors import CORS
import pymysql.cursors
app = Flask(__name__)

CORS(
    app,
    resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}},
    supports_credentials=True
)

# 🔗 Conexión a la DB con pymysql
def get_db_connection():
    conn = pymysql.connect(
        host="10.9.120.5",
        port=3306,
        user="heladeria",
        password="papus1234",
        database="heladeria_papus",
        cursorclass=pymysql.cursors.DictCursor  # 👈 ya devuelve diccionarios
    )
    return conn




# ---------------- Sabores ---------------- #
@app.route("/api/sabores", methods=["GET"])
def get_sabores():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT nombre_sabor FROM sabores")
    sabores = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(sabores)

# ---------------- RUN ---------------- #
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
