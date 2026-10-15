from database.conexao import get_db_connection


def buscar_produtos(termo, pagina, quantidade, estado):
    conexao = get_db_connection()
    cursor = conexao.cursor(dictionary=True)
    inicio = (pagina - 1) * quantidade

    try:
        cursor.execute(
            "SELECT COUNT(*) AS total FROM produtos "
            "WHERE (titulo LIKE %s OR descricao LIKE %s) AND (%s = '' OR estado = %s)",
            ("%" + termo + "%", "%" + termo + "%", estado, estado)
        )
        total = cursor.fetchone()["total"]

        cursor.execute(
            "SELECT produtos.id, produtos.titulo, produtos.descricao, produtos.preco, "
            "produtos.estado, produtos.usuario_id, usuarios.nome AS vendedor_nome "
            "FROM produtos JOIN usuarios ON usuarios.id = produtos.usuario_id "
            "WHERE (produtos.titulo LIKE %s OR produtos.descricao LIKE %s) "
            "AND (%s = '' OR produtos.estado = %s) "
            "ORDER BY produtos.id LIMIT %s OFFSET %s",
            ("%" + termo + "%", "%" + termo + "%", estado, estado, quantidade, inicio)
        )
        return cursor.fetchall(), total
    finally:
        cursor.close()


def buscar_produto(produto_id):
    conexao = get_db_connection()
    cursor = conexao.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT produtos.id, produtos.titulo, produtos.descricao, produtos.preco, "
            "produtos.estado, produtos.usuario_id, usuarios.nome AS vendedor_nome "
            "FROM produtos JOIN usuarios ON usuarios.id = produtos.usuario_id "
            "WHERE produtos.id = %s",
            (produto_id,)
        )
        return cursor.fetchone()
    finally:
        cursor.close()
