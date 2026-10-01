import mysql.connector


def conectar():
    conexao = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="techstore"
    )

    return conexao

conexao = conectar()

print("Conexão com MySQL realizada com sucesso!")

conexao.close()