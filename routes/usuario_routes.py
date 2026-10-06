from flask import Blueprint

from controllers.usuario_controller import (
    encerrar_sessao,
    iniciar_sessao,
    perfil_usuario,
    usuario_atual,
)

usuarios_bp = Blueprint("usuarios", __name__, url_prefix="/api/usuarios")
auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


@usuarios_bp.get("/<int:usuario_id>")
def rota_usuario(usuario_id):
    return perfil_usuario(usuario_id)


@auth_bp.post("/login")
def rota_login():
    return iniciar_sessao()


@auth_bp.get("/me")
def rota_sessao_atual():
    return usuario_atual()


@auth_bp.post("/logout")
def rota_logout():
    return encerrar_sessao()