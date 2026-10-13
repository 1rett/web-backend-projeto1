from flask import jsonify

from models.usuario import buscar_usuario_com_produtos, buscar_usuarios_por_nome


def buscar_usuarios(termo):
    termo = termo.strip()
    if not termo:
        return jsonify({"erro": "Informe um nome para buscar."}), 400

    usuarios = buscar_usuarios_por_nome(termo)
    return jsonify({"busca": termo, "usuarios": usuarios})


def perfil_usuario(usuario_id):
    usuario = buscar_usuario_com_produtos(usuario_id)

    if usuario is None:
        return jsonify({"erro": "Usuário não encontrado."}), 404

    for produto in usuario["produtos"]:
        produto["preco"] = float(produto["preco"])

    return jsonify(usuario)
