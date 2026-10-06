from flask import jsonify, request, session
from werkzeug.security import check_password_hash

from models.usuario import (
    buscar_usuario_com_produtos,
    buscar_usuario_por_email,
    buscar_usuario_por_id,
)

USUARIOS_DO_CATALOGO = {
    "rafaelrett@gmail.com",
    "geovaniklocher@gmail.com",
    "willianwatanabe@gmail.com",
    "neymarjr@gmail.com",
}


def iniciar_sessao():
    dados = request.get_json(silent=True)
    if not isinstance(dados, dict):
        return jsonify({"erro": "Envie e-mail e senha em formato JSON."}), 400

    email = dados.get("email")
    senha = dados.get("senha")
    if not isinstance(email, str) or not isinstance(senha, str) or not email or not senha:
        return jsonify({"erro": "E-mail e senha são obrigatórios."}), 400

    email = email.strip().lower()
    if email not in USUARIOS_DO_CATALOGO:
        return jsonify({"erro": "E-mail ou senha incorretos."}), 401

    usuario = buscar_usuario_por_email(email)
    if (
        usuario is None
        or not usuario["senha_hash"]
        or not check_password_hash(usuario["senha_hash"], senha)
    ):
        return jsonify({"erro": "E-mail ou senha incorretos."}), 401

    session.clear()
    session["usuario_id"] = usuario["id"]
    return jsonify(
        {"usuario": {"id": usuario["id"], "nome": usuario["nome"], "email": usuario["email"]}}
    )


def usuario_atual():
    usuario_id = session.get("usuario_id")
    if usuario_id is None:
        return jsonify({"usuario": None})

    usuario = buscar_usuario_por_id(usuario_id)
    if usuario is None:
        session.clear()
        return jsonify({"usuario": None})
    return jsonify(
        {"usuario": {"id": usuario["id"], "nome": usuario["nome"], "email": usuario["email"]}}
    )


def encerrar_sessao():
    session.clear()
    return jsonify({"mensagem": "Sessão encerrada."})


def perfil_usuario(usuario_id):
    usuario = buscar_usuario_com_produtos(usuario_id)

    if usuario is None:
        return jsonify({"erro": "Usuário não encontrado."}), 404

    for produto in usuario["produtos"]:
        produto["preco"] = float(produto["preco"])

    return jsonify(usuario)
