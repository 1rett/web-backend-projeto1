import math

from flask import jsonify, request

from models.produto import buscar_produto_por_id, buscar_produtos


def _converter_precos(produtos):
    for produto in produtos:
        produto["preco"] = float(produto["preco"])


def _responder(termo):
    pagina = request.args.get("pagina", 1, type=int)
    por_pagina = request.args.get("por_pagina", 4, type=int)
    estado = request.args.get("estado", "").strip().upper()

    if pagina < 1:
        pagina = 1
    if por_pagina < 1:
        por_pagina = 4
    por_pagina = min(por_pagina, 100)

    produtos, total = buscar_produtos(termo, pagina, por_pagina, estado)
    _converter_precos(produtos)

    total_paginas = math.ceil(total / por_pagina)

    return jsonify(
        {
            "busca": termo,
            "pagina": pagina,
            "por_pagina": por_pagina,
            "estado": estado,
            "total": total,
            "total_paginas": total_paginas,
            "produtos": produtos,
        }
    )


def listar_produtos():
    termo = request.args.get("busca", "").strip()
    return _responder(termo)


def buscar_por_termo(termo):
    return _responder(termo.strip())


def produto_por_id(produto_id):
    produto = buscar_produto_por_id(produto_id)
    if produto is None:
        return jsonify({"erro": "Produto não encontrado."}), 404
    _converter_precos([produto])
    return jsonify(produto)
