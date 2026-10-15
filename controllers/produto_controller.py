from flask import jsonify, request

from models.produto import buscar_produto, buscar_produtos


def listar_produtos(termo=None):
    if termo is None:
        termo = request.args.get("busca", "").strip()
    else:
        termo = termo.strip()
    pagina_texto = request.args.get("pagina", "1")
    quantidade_texto = request.args.get("por_pagina", "8")
    estado = request.args.get("estado", "").strip().upper()

    try:
        pagina = int(pagina_texto)
        quantidade = int(quantidade_texto)
    except ValueError:
        return jsonify({"erro": "Página e quantidade devem ser números inteiros."}), 400

    if pagina < 1 or quantidade < 1:
        return jsonify({"erro": "Página e quantidade devem ser maiores que zero."}), 400

    # Limita a quantidade para evitar uma resposta muito grande.
    if quantidade > 100:
        quantidade = 100

    produtos, total = buscar_produtos(termo, pagina, quantidade, estado)
    for produto in produtos:
        produto["preco"] = float(produto["preco"])

    total_paginas = (total + quantidade - 1) // quantidade

    return jsonify({
        "busca": termo,
        "pagina": pagina,
        "por_pagina": quantidade,
        "estado": estado,
        "total": total,
        "total_paginas": total_paginas,
        "produtos": produtos,
    })


def produto_por_id(produto_id):
    produto = buscar_produto(produto_id)
    if produto is None:
        return jsonify({"erro": "Produto não encontrado."}), 404
    produto["preco"] = float(produto["preco"])
    return jsonify(produto)
