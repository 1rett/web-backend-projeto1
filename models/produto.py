from database.conexao import get_db_connection


def _campos_produto():
    return """
        SELECT produtos.id, produtos.titulo, produtos.descricao, produtos.preco,
               produtos.codigo, produtos.categoria, produtos.estado, produtos.imagem_url,
               produtos.estoque, produtos.cor_principal, produtos.cor_secundaria,
               produtos.padrao, produtos.usuario_id,
               usuarios.nome AS vendedor_nome
        FROM produtos
        JOIN usuarios ON usuarios.id = produtos.usuario_id
    """


def buscar_produtos(termo="", pagina=1, por_pagina=4, estado=""):
    conexao = get_db_connection()
    cursor = conexao.cursor(dictionary=True)

    try:
        condicoes = ["(produtos.titulo LIKE %s OR produtos.descricao LIKE %s)"]
        parametros = [f"%{termo}%", f"%{termo}%"]
        if estado:
            condicoes.append("produtos.estado = %s")
            parametros.append(estado)
        filtro = " AND ".join(condicoes)

        cursor.execute(
            f"SELECT COUNT(*) AS total FROM produtos WHERE {filtro}",
            tuple(parametros)
        )
        total = cursor.fetchone()["total"]

        offset = (pagina - 1) * por_pagina
        cursor.execute(
            f"{_campos_produto()} WHERE {filtro} ORDER BY produtos.id LIMIT %s OFFSET %s",
            (*parametros, por_pagina, offset)
        )
        return cursor.fetchall(), total
    finally:
        cursor.close()
        conexao.close()


def buscar_produto_por_id(produto_id):
    conexao = get_db_connection()
    cursor = conexao.cursor(dictionary=True)

    try:
        cursor.execute(
            f"{_campos_produto()} WHERE produtos.id = %s",
            (produto_id,)
        )
        return cursor.fetchone()
    finally:
        cursor.close()
        conexao.close()
