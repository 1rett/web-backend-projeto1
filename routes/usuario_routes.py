from flask import Blueprint

from controllers.usuario_controller import buscar_usuarios, perfil_usuario

usuarios_bp = Blueprint("usuarios", __name__, url_prefix="/api/usuarios")


@usuarios_bp.route("/busca/<string:termo>", methods=["GET"])
def rota_busca_usuarios(termo):
    return buscar_usuarios(termo)


@usuarios_bp.route("/<int:usuario_id>", methods=["GET"])
def rota_usuario(usuario_id):
    return perfil_usuario(usuario_id)
