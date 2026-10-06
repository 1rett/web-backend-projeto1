import re

from flask import jsonify, request, session
from mysql.connector import IntegrityError
from werkzeug.security import check_password_hash, generate_password_hash

from models.usuario import (
    buscar_usuario_com_produtos,
    buscar_usuario_por_email,
    buscar_usuario_por_id,
    criar_usuario,
)


def _dados_usuario(usuario):
    return {"id": usuario["id"], "nome": usuario["nome"], "email": usuario["email"]}


def cadastrar_usuario():
    dados = request.get_json(silent=True)
    if not isinstance(dados, dict):
        return jsonify({"erro": "Envie nome, e-mail e senha em formato JSON."}), 400

    nome = dados.get("nome")
    email = dados.get("email")
    senha = dados.get("senha")
    if not all(isinstance(valor, str) for valor in (nome, email, senha)):
        return jsonify({"erro": "Nome, e-mail e senha são obrigatórios."}), 400

    nome = nome.strip()
    email = email.strip().lower()
    if len(nome) < 2 or len(nome) > 100:
        return jsonify({"erro": "O nome deve ter entre 2 e 100 caracteres."}), 400
    if len(email) > 100 or not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        return jsonify({"erro": "Digite um e-mail válido com até 100 caracteres."}), 400
    if len(senha) < 8:
        return jsonify({"erro": "A senha deve ter pelo menos 8 caracteres."}), 400

    if buscar_usuario_por_email(email) is not None:
        return jsonify({"erro": "Este e-mail já está cadastrado."}), 409

    try:
        usuario_id = criar_usuario(nome, email, generate_password_hash(senha))
    except IntegrityError:
        return jsonify({"erro": "Este e-mail já está cadastrado."}), 409

    session.clear()
    session["usuario_id"] = usuario_id
    return jsonify({"usuario": {"id": usuario_id, "nome": nome, "email": email}}), 201


def iniciar_sessao():
    dados = request.get_json(silent=True)
    if not isinstance(dados, dict):
        return jsonify({"erro": "Envie e-mail e senha em formato JSON."}), 400

    email = dados.get("email")
    senha = dados.get("senha")
    if not isinstance(email, str) or not isinstance(senha, str) or not email or not senha:
        return jsonify({"erro": "E-mail e senha são obrigatórios."}), 400

    usuario = buscar_usuario_por_email(email.strip().lower())
    if (
        usuario is None
        or not isinstance(usuario.get("senha_hash"), str)
        or not check_password_hash(usuario["senha_hash"], senha)
    ):
        return jsonify({"erro": "E-mail ou senha incorretos."}), 401

    session.clear()
    session["usuario_id"] = usuario["id"]
    return jsonify({"usuario": _dados_usuario(usuario)})


def usuario_atual():
    usuario_id = session.get("usuario_id")
    if usuario_id is None:
        return jsonify({"usuario": None})

    usuario = buscar_usuario_por_id(usuario_id)
    if usuario is None:
        session.clear()
        return jsonify({"usuario": None})
    return jsonify({"usuario": _dados_usuario(usuario)})


def encerrar_sessao():
    return jsonify({"mensagem": "Sessão encerrada."})


def perfil_usuario(usuario_id):
    usuario = buscar_usuario_com_produtos(usuario_id)

    if usuario is None:
        return jsonify({"erro": "Usuario nao encontrado."}), 404

    for produto in usuario["produtos"]:
        produto["preco"] = float(produto["preco"])

    return jsonify(usuario)
