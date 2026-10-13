from database.conexao import obter_conexao


def buscar_produtos(termo, pagina, quantidade, estado):
    conexao = obter_conexao()
    cursor = conexao.cursor(dictionary=True)
    inicio = (pagina - 1) * quantidade

    # A consulta usa parâmetros para que o texto da busca não vire código SQL.
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
    produtos = cursor.fetchall()
    cursor.close()
    conexao.close()
    return produtos, total


def buscar_produto(produto_id):
    conexao = obter_conexao()
    cursor = conexao.cursor(dictionary=True)
    cursor.execute(
        "SELECT produtos.id, produtos.titulo, produtos.descricao, produtos.preco, "
        "produtos.estado, produtos.usuario_id, usuarios.nome AS vendedor_nome "
        "FROM produtos JOIN usuarios ON usuarios.id = produtos.usuario_id "
        "WHERE produtos.id = %s",
        (produto_id,)
    )
    produto = cursor.fetchone()
    cursor.close()
    conexao.close()
    return produto
