from flask import Flask, render_template

from controllers.produto_controller import listar_produtos, buscar_por_termo
from controllers.usuario_controller import perfil_usuario

app = Flask(__name__)


# Pagina inicial (front-end em templates/index.html)
@app.route("/")
def index():
    return render_template("index.html")


# Busca de produtos com paginacao
# Exemplo: /api/produtos?busca=palmeiras&pagina=1&por_pagina=4
@app.route("/api/produtos")
def rota_produtos():
    return listar_produtos()


# Busca de produtos com o termo na propria rota (rota parametrizada)
# Exemplo: /api/produtos/busca/flamengo?pagina=1
@app.route("/api/produtos/busca/<termo>")
def rota_busca_termo(termo):
    return buscar_por_termo(termo)


# Perfil do usuario com os produtos dele (rota parametrizada)
# Exemplo: /api/usuarios/1
@app.route("/api/usuarios/<int:usuario_id>")
def rota_usuario(usuario_id):
    return perfil_usuario(usuario_id)


if __name__ == "__main__":
    app.run(debug=True)
