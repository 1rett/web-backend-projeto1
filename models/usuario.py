from database.conexao import get_db_connection


def buscar_usuario_com_produtos(usuario_id):
    conexao = get_db_connection()
    cursor = conexao.cursor(dictionary=True)

    cursor.execute(
        "SELECT id, nome, email FROM usuarios WHERE id = %s",
        (usuario_id,)
    )
    usuario = cursor.fetchone()

    if usuario is not None:
        cursor.execute(
            """
            SELECT id, titulo, descricao, preco, categoria, imagem_url, usuario_id
            FROM produtos
            WHERE usuario_id = %s
            """,
            (usuario_id,)
        )
        usuario["produtos"] = cursor.fetchall()

    cursor.close()
    conexao.close()
    return usuario
