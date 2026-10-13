from flask import jsonify, request

from models.produto import buscar_produto_por_id, buscar_produtos


def converter_precos(produtos):
    for produto in produtos:
        produto["preco"] = float(produto["preco"])


def responder_busca(termo):
    pagina_texto = request.args.get("pagina", "1")
    por_pagina_texto = request.args.get("por_pagina", "4")
    try:
        pagina = int(pagina_texto)
        por_pagina = int(por_pagina_texto)
    except (TypeError, ValueError):
        return jsonify({"erro": "Página e quantidade por página devem ser números inteiros."}), 400

    if pagina < 1 or por_pagina < 1:
        return jsonify({"erro": "Página e quantidade por página devem ser maiores que zero."}), 400

    estado = request.args.get("estado", "").strip().upper()
    if por_pagina > 100:
        por_pagina = 100

    produtos, total = buscar_produtos(termo, pagina, por_pagina, estado)
    converter_precos(produtos)

    # Calcula as páginas arredondando para cima com uma conta inteira.
    total_paginas = (total + por_pagina - 1) // por_pagina

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
    return responder_busca(termo)


def buscar_por_termo(termo):
    return responder_busca(termo.strip())


def produto_por_id(produto_id):
    produto = buscar_produto_por_id(produto_id)
    if produto is None:
        return jsonify({"erro": "Produto não encontrado."}), 404
    converter_precos([produto])
    return jsonify(produto)
