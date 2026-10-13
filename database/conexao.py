import mysql.connector


def obter_conexao():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="marketplace_db",
        charset="utf8mb4",
    )
