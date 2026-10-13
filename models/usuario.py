from database.conexao import get_db_connection


def buscar_usuarios_por_nome(termo):
    conexao = get_db_connection()
    cursor = conexao.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT id, nome FROM usuarios WHERE nome LIKE %s ORDER BY nome LIMIT 20",
            (f"%{termo}%",)
        )
        return cursor.fetchall()
    finally:
        cursor.close()
        conexao.close()


def buscar_usuario_com_produtos(usuario_id):
    conexao = get_db_connection()
    cursor = conexao.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT id, nome, email FROM usuarios WHERE id = %s",
            (usuario_id,)
        )
        usuario = cursor.fetchone()

        if usuario is not None:
            cursor.execute(
                """
                SELECT id, titulo, preco
                FROM produtos
                WHERE usuario_id = %s
                ORDER BY id
                """,
                (usuario_id,)
            )
            usuario["produtos"] = cursor.fetchall()

        return usuario
    finally:
        cursor.close()
        conexao.close()
