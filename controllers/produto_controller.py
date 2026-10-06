import math

from flask import jsonify, request

from models.produto import buscar_produtos


def _responder(termo):
    pagina = request.args.get("pagina", 1, type=int)
    por_pagina = request.args.get("por_pagina", 4, type=int)

    if pagina < 1:
        pagina = 1
    if por_pagina < 1:
        por_pagina = 4

    produtos, total = buscar_produtos(termo, pagina, por_pagina)

    for produto in produtos:
        produto["preco"] = float(produto["preco"])

    total_paginas = math.ceil(total / por_pagina)

    return jsonify(
        {
            "busca": termo,
            "pagina": pagina,
            "por_pagina": por_pagina,
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
