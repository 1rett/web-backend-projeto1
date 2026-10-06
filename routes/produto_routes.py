from flask import Blueprint

from controllers.produto_controller import (
    buscar_por_termo,
    listar_produtos,
    produto_por_id,
)

produtos_bp = Blueprint("produtos", __name__, url_prefix="/api/produtos")


@produtos_bp.get("")
def rota_produtos():
    return listar_produtos()


@produtos_bp.get("/busca/<string:termo>")
def rota_busca_termo(termo):
    return buscar_por_termo(termo)


@produtos_bp.get("/<int:produto_id>")
def rota_produto(produto_id):
    return produto_por_id(produto_id)