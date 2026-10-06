import os
import secrets

from flask import Flask, render_template

from routes.produto_routes import produtos_bp
from routes.usuario_routes import auth_bp, usuarios_bp

app = Flask(__name__)
app.config.update(
    SECRET_KEY=os.environ.get("FLASK_SECRET_KEY") or secrets.token_hex(32),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
)
app.register_blueprint(produtos_bp)
app.register_blueprint(usuarios_bp)
app.register_blueprint(auth_bp)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login")
def pagina_login():
    return render_template("login.html")


@app.route("/produto/<int:produto_id>")
def pagina_produto(produto_id):
    return render_template("produto.html", produto_id=produto_id)


@app.route("/usuarios/<int:usuario_id>")
def pagina_usuario(usuario_id):
    return render_template("perfil.html", usuario_id=usuario_id)


if __name__ == "__main__":
    app.run(debug=True)
