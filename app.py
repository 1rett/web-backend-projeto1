import os
import secrets

from flask import Flask, render_template, session

from controllers.produto_controller import listar_produtos, buscar_por_termo
from controllers.usuario_controller import (
    cadastrar_usuario,
    encerrar_sessao,
    iniciar_sessao,
    perfil_usuario,
    usuario_atual,
)

app = Flask(__name__)
app.config.update(
    SECRET_KEY=os.environ.get("FLASK_SECRET_KEY") or secrets.token_hex(32),
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/login")
def pagina_login():
    return render_template("login.html")


@app.route("/api/produtos")
def rota_produtos():
    return listar_produtos()


@app.route("/api/produtos/busca/<termo>")
def rota_busca_termo(termo):
    return buscar_por_termo(termo)


@app.route("/api/usuarios/<int:usuario_id>")
def rota_usuario(usuario_id):
    return perfil_usuario(usuario_id)


@app.route("/api/auth/register", methods=["POST"])
def rota_cadastro():
    return cadastrar_usuario()


@app.route("/api/auth/login", methods=["POST"])
def rota_login():
    return iniciar_sessao()


@app.route("/api/auth/me")
def rota_sessao_atual():
    return usuario_atual()


@app.route("/api/auth/logout", methods=["POST"])
def rota_logout():
    session.clear()
    return encerrar_sessao()


if __name__ == "__main__":
    app.run(debug=True)
