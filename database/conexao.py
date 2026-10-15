import os

import mysql.connector
from flask import g


def get_db_connection():
    if "db_connection" not in g:
        g.db_connection = mysql.connector.connect(
            host=os.environ.get("MYSQL_HOST", "localhost"),
            port=int(os.environ.get("MYSQL_PORT", "3306")),
            user=os.environ.get("MYSQL_USER", "root"),
            password=os.environ.get("MYSQL_PASSWORD", ""),
            database=os.environ.get("MYSQL_DATABASE", "marketplace_db"),
            charset="utf8mb4",
        )
    return g.db_connection


def close_db_connection(exception=None):
    conexao = g.pop("db_connection", None)
    if conexao is not None:
        conexao.close()
