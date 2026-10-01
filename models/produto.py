from database.conexao import get_db_connection


def buscar_produtos(termo="", pagina=1, por_pagina=4):
    conexao = get_db_connection()
    cursor = conexao.cursor(dictionary=True)

    termo_busca = f"%{termo}%"
    cursor.execute(
        """
        SELECT COUNT(*) AS total
        FROM produtos
        WHERE titulo LIKE %s OR descricao LIKE %s
        """,
        (termo_busca, termo_busca)
    )
    total = cursor.fetchone()["total"]

    offset = (pagina - 1) * por_pagina
    cursor.execute(
        """
        SELECT id, titulo, descricao, preco, categoria, imagem_url, usuario_id
        FROM produtos
        WHERE titulo LIKE %s OR descricao LIKE %s
        LIMIT %s OFFSET %s
        """,
        (termo_busca, termo_busca, por_pagina, offset)
    )
    produtos = cursor.fetchall()

    cursor.close()
    conexao.close()
    return produtos, total
