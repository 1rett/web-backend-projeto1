from flask import jsonify

from models.usuario import buscar_usuario_com_produtos


def perfil_usuario(usuario_id):
    usuario = buscar_usuario_com_produtos(usuario_id)

    # Se o usuario nao existe, responde 404
    if usuario is None:
        return jsonify({"erro": "Usuario nao encontrado."}), 404

    # Converte Decimal para float para o jsonify conseguir serializar
    for produto in usuario["produtos"]:
        produto["preco"] = float(produto["preco"])

    return jsonify(usuario)
