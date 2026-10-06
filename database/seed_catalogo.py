import argparse
import secrets

from werkzeug.security import generate_password_hash

from database.conexao import get_db_connection

USUARIOS = (
    ("Rafael Rett", "rafaelrett@gmail.com"),
    ("Geovani Kloche", "geovaniklocher@gmail.com"),
    ("Willian Watanabe", "willianwatanabe@gmail.com"),
    ("Neymar Junior", "neymarjr@gmail.com"),
)

# Código, camisa, estado, descrição, vendedor, cores e padrão ilustrativo.
CLUBES = (
    ("PAL", "Palmeiras", "SP", "Camisa titular verde e branca.", "rafaelrett@gmail.com", "#087a3b", "#ffffff", "v"),
    ("COR", "Corinthians", "SP", "Camisa titular branca e preta.", "geovaniklocher@gmail.com", "#f7f7f7", "#111111", "v"),
    ("MIR", "Mirassol", "SP", "Camisa titular amarela e verde.", "neymarjr@gmail.com", "#f4d21f", "#087a3b", "v"),
    ("RBB", "Red Bull Bragantino", "SP", "Camisa titular branca e vermelha.", "neymarjr@gmail.com", "#f7f7f7", "#d71920", "v"),
    ("SAN", "Santos", "SP", "Camisa titular branca e preta.", "willianwatanabe@gmail.com", "#f7f7f7", "#111111", "v"),
    ("SAO", "São Paulo", "SP", "Camisa titular branca, vermelha e preta.", "rafaelrett@gmail.com", "#f7f7f7", "#d71920", "h"),
    ("BOT", "Botafogo", "RJ", "Camisa titular listrada preta e branca.", "willianwatanabe@gmail.com", "#111111", "#f7f7f7", "v"),
    ("FLA", "Flamengo", "RJ", "Camisa titular rubro-negra.", "geovaniklocher@gmail.com", "#c8102e", "#111111", "h"),
    ("FLU", "Fluminense", "RJ", "Camisa titular tricolor grená, verde e branca.", "neymarjr@gmail.com", "#7a1732", "#087a3b", "v"),
    ("VAS", "Vasco", "RJ", "Camisa titular preta e branca.", "neymarjr@gmail.com", "#111111", "#f7f7f7", "h"),
    ("CAM", "Atlético Mineiro", "MG", "Camisa titular listrada preta e branca.", "geovaniklocher@gmail.com", "#111111", "#f7f7f7", "v"),
    ("CRU", "Cruzeiro", "MG", "Camisa titular azul e branca.", "willianwatanabe@gmail.com", "#005ca9", "#f7f7f7", "v"),
    ("BAH", "Bahia", "BA", "Camisa titular branca, azul e vermelha.", "rafaelrett@gmail.com", "#f7f7f7", "#005ca9", "h"),
    ("VIT", "Vitória", "BA", "Camisa titular rubro-negra.", "willianwatanabe@gmail.com", "#c8102e", "#111111", "h"),
    ("CAP", "Athletico Paranaense", "PR", "Camisa titular rubro-negra.", "geovaniklocher@gmail.com", "#c8102e", "#111111", "h"),
    ("CFC", "Coritiba", "PR", "Camisa titular verde e branca.", "willianwatanabe@gmail.com", "#087a3b", "#f7f7f7", "v"),
    ("GRE", "Grêmio", "RS", "Camisa titular azul, preta e branca.", "rafaelrett@gmail.com", "#087bb5", "#111111", "h"),
    ("INT", "Internacional", "RS", "Camisa titular vermelha e branca.", "neymarjr@gmail.com", "#c8102e", "#f7f7f7", "v"),
    ("REM", "Remo", "PA", "Camisa titular azul-marinho e branca.", "rafaelrett@gmail.com", "#142b63", "#f7f7f7", "h"),
    ("CHA", "Chapecoense", "SC", "Camisa titular verde e branca.", "geovaniklocher@gmail.com", "#087a3b", "#f7f7f7", "v"),
)

PRECO_ILUSTRATIVO = 249.90
ESTOQUE_INICIAL_ILUSTRATIVO = 12


def preparar_usuarios(cursor, reset_senhas=False):
    credenciais_temporarias = []
    ids_por_email = {}

    for nome, email in USUARIOS:
        cursor.execute(
            "SELECT id, senha_hash FROM usuarios WHERE email = %s",
            (email,),
        )
        usuario = cursor.fetchone()

        if usuario is None:
            # Reutiliza contas antigas que tinham o mesmo nome e outro e-mail.
            cursor.execute(
                "SELECT id, senha_hash FROM usuarios WHERE nome = %s",
                (nome,),
            )
            usuario = cursor.fetchone()
            if usuario is not None:
                cursor.execute(
                    "UPDATE usuarios SET email = %s WHERE id = %s",
                    (email, usuario["id"]),
                )

        if usuario is None:
            senha_temporaria = secrets.token_urlsafe(12)
            cursor.execute(
                """
                INSERT INTO usuarios (nome, email, senha_hash)
                VALUES (%s, %s, %s)
                """,
                (nome, email, generate_password_hash(senha_temporaria)),
            )
            ids_por_email[email] = cursor.lastrowid
            credenciais_temporarias.append((email, senha_temporaria))
        else:
            ids_por_email[email] = usuario["id"]
            if reset_senhas or not usuario["senha_hash"]:
                senha_temporaria = secrets.token_urlsafe(12)
                cursor.execute(
                    "UPDATE usuarios SET senha_hash = %s WHERE id = %s",
                    (generate_password_hash(senha_temporaria), usuario["id"]),
                )
                credenciais_temporarias.append((email, senha_temporaria))

    return ids_por_email, credenciais_temporarias


def preparar_catalogo(cursor, ids_por_email):
    adicionados = 0
    for codigo, nome, estado, descricao, email_vendedor, cor, cor_secundaria, listras in CLUBES:
        cursor.execute(
            "SELECT id FROM produtos WHERE codigo = %s",
            (f"BR26-{codigo}",),
        )
        if cursor.fetchone() is not None:
            continue

        cursor.execute(
            """
            INSERT INTO produtos (
                codigo, titulo, descricao, preco, categoria, estado, imagem_url,
                estoque, cor_principal, cor_secundaria, padrao, usuario_id
            )
            VALUES (%s, %s, %s, %s, %s, %s, NULL, %s, %s, %s, %s, %s)
            """,
            (
                f"BR26-{codigo}",
                f"Camisa {nome} 2026 (ilustrativa)",
                descricao,
                PRECO_ILUSTRATIVO,
                "Brasileirão Série A 2026",
                estado,
                ESTOQUE_INICIAL_ILUSTRATIVO,
                cor,
                cor_secundaria,
                listras,
                ids_por_email[email_vendedor],
            ),
        )
        adicionados += 1

    return adicionados


def main():
    parser = argparse.ArgumentParser(description="Prepara as contas e os produtos do catálogo.")
    parser.add_argument(
        "--reset-senhas",
        action="store_true",
        help="gera uma nova senha temporária para cada vendedor do catálogo",
    )
    argumentos = parser.parse_args()

    conexao = get_db_connection()
    cursor = conexao.cursor(dictionary=True)
    try:
        ids_por_email, credenciais = preparar_usuarios(
            cursor,
            reset_senhas=argumentos.reset_senhas,
        )
        adicionados = preparar_catalogo(cursor, ids_por_email)
        conexao.commit()
    except Exception:
        conexao.rollback()
        raise
    finally:
        cursor.close()
        conexao.close()

    print(f"Catálogo pronto: {adicionados} produtos novos adicionados.")
    if credenciais:
        print("Guarde estas senhas temporárias; elas não serão exibidas novamente:")
        for email, senha in credenciais:
            print(f"{email}: {senha}")
    else:
        print("As quatro contas já tinham senha; nenhuma senha foi alterada.")


if __name__ == "__main__":
    main()
