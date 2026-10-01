import math

from flask import jsonify, request

from models.produto import buscar_produtos


def _responder(termo):
    # Le pagina e por_pagina da URL (se faltar ou nao for numero, usa o padrao)
    pagina = request.args.get("pagina", 1, type=int)
    por_pagina = request.args.get("por_pagina", 4, type=int)

    # Evita valores invalidos (zero ou negativos)
    if pagina < 1:
        pagina = 1
    if por_pagina < 1:
        por_pagina = 4

    # O model faz as consultas no MySQL
    produtos, total = buscar_produtos(termo, pagina, por_pagina)

    # O MySQL devolve preco como Decimal, que o jsonify nao converte
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
    # Termo vem da query string: ?busca=...
    termo = request.args.get("busca", "").strip()
    return _responder(termo)


def buscar_por_termo(termo):
    # Termo vem da propria rota: /api/produtos/busca/<termo>
    return _responder(termo.strip())
