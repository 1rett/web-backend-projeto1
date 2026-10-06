from flask import jsonify

from models.usuario import buscar_usuario_com_produtos


def perfil_usuario(usuario_id):
    usuario = buscar_usuario_com_produtos(usuario_id)

    if usuario is None:
        return jsonify({"erro": "Usuário não encontrado."}), 404

    for produto in usuario["produtos"]:
        produto["preco"] = float(produto["preco"])

    return jsonify(usuario)
