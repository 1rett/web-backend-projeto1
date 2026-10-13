from flask import Blueprint

from controllers.usuario_controller import buscar_usuarios, perfil_usuario

usuarios_bp = Blueprint("usuarios", __name__, url_prefix="/api/usuarios")


@usuarios_bp.get("/busca/<string:termo>")
def rota_busca_usuarios(termo):
    return buscar_usuarios(termo)


@usuarios_bp.get("/<int:usuario_id>")
def rota_usuario(usuario_id):
    return perfil_usuario(usuario_id)
