from flask import Flask, render_template

from controllers.produto_controller import listar_produtos, buscar_por_termo
from controllers.usuario_controller import perfil_usuario

app = Flask(__name__)


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


if __name__ == "__main__":
    app.run(debug=True)
