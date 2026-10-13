from database.conexao import obter_conexao


def buscar_usuarios(termo):
    conexao = obter_conexao()
    cursor = conexao.cursor(dictionary=True)
    cursor.execute(
        "SELECT id, nome FROM usuarios WHERE nome LIKE %s ORDER BY nome LIMIT 20",
        ("%" + termo + "%",)
    )
    usuarios = cursor.fetchall()
    cursor.close()
    conexao.close()
    return usuarios


def buscar_usuario(usuario_id):
    conexao = obter_conexao()
    cursor = conexao.cursor(dictionary=True)
    cursor.execute(
        "SELECT id, nome, email FROM usuarios WHERE id = %s",
        (usuario_id,)
    )
    usuario = cursor.fetchone()

    if usuario is not None:
        cursor.execute(
            "SELECT id, titulo, preco FROM produtos "
            "WHERE usuario_id = %s ORDER BY id",
            (usuario_id,)
        )
        usuario["produtos"] = cursor.fetchall()

    cursor.close()
    conexao.close()
    return usuario
