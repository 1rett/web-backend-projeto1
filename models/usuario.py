from database.conexao import get_db_connection


def buscar_usuario_por_email(email):
    conexao = get_db_connection()
    cursor = conexao.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT id, nome, email, senha_hash FROM usuarios WHERE email = %s",
            (email,)
        )
        return cursor.fetchone()
    finally:
        cursor.close()
        conexao.close()


def buscar_usuario_por_id(usuario_id):
    conexao = get_db_connection()
    cursor = conexao.cursor(dictionary=True)

    try:
        cursor.execute(
            "SELECT id, nome, email FROM usuarios WHERE id = %s",
            (usuario_id,)
        )
        return cursor.fetchone()
    finally:
        cursor.close()
        conexao.close()


def criar_usuario(nome, email, senha_hash):
    conexao = get_db_connection()
    cursor = conexao.cursor()

    try:
        cursor.execute(
            "INSERT INTO usuarios (nome, email, senha_hash) VALUES (%s, %s, %s)",
            (nome, email, senha_hash)
        )
        conexao.commit()
        return cursor.lastrowid
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
                SELECT id, titulo, descricao, preco, categoria, imagem_url, usuario_id
                FROM produtos
                WHERE usuario_id = %s
                """,
                (usuario_id,)
            )
            usuario["produtos"] = cursor.fetchall()

        return usuario
    finally:
        cursor.close()
        conexao.close()
