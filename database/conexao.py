import mysql.connector


def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="sua_senha",
        database="marketplace_db"
    )
