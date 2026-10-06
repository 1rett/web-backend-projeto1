from flask import Blueprint

from controllers.usuario_controller import perfil_usuario

usuarios_bp = Blueprint("usuarios", __name__, url_prefix="/api/usuarios")


@usuarios_bp.get("/<int:usuario_id>")
def rota_usuario(usuario_id):
    return perfil_usuario(usuario_id)