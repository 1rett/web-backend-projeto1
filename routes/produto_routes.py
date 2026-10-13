from flask import Blueprint

from controllers.produto_controller import listar_produtos, produto_por_id

produtos_bp = Blueprint("produtos", __name__, url_prefix="/api/produtos")


@produtos_bp.route("", methods=["GET"])
def rota_produtos():
    return listar_produtos()


@produtos_bp.route("/busca/<string:termo>", methods=["GET"])
def rota_busca_termo(termo):
    return listar_produtos(termo)


@produtos_bp.route("/<int:produto_id>", methods=["GET"])
def rota_produto(produto_id):
    return produto_por_id(produto_id)
