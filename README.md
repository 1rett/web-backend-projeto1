# Arquibancada

Projeto de Back-End para pesquisar camisas de futebol. O Flask entrega as páginas e a API; o MySQL guarda os usuários e os produtos.

## Arquivos

- `app.py`: cria o Flask e entrega as páginas HTML.
- `routes/`: declara os endereços da API.
- `controllers/`: lê os parâmetros, chama os Models e monta as respostas JSON.
- `models/`: executa as consultas SQL parametrizadas.
- `database/conexao.py`: abre a conexão com MySQL.
- `database/banco.sql`: cria as tabelas e insere quatro usuários e vinte camisas.
- `templates/`: páginas HTML.
- `static/`: JavaScript e CSS usados pelas páginas.

O caminho de uma consulta é: navegador → rota → Controller → Model → MySQL. A resposta volta como JSON para o JavaScript mostrar na página.

## Preparar o projeto

O projeto usa Python, Flask, mysql-connector-python e MySQL. Não são necessárias outras bibliotecas Python.

1. Instale as dependências: `pip install -r requirements.txt`.
2. Execute `database/banco.sql` no MySQL Workbench. Atenção: o script apaga e recria as tabelas `produtos` e `usuarios`.
3. Se necessário, ajuste usuário, senha e nome do banco em `database/conexao.py` para combinar com o MySQL instalado.
4. Inicie com `python app.py` e abra `http://127.0.0.1:5000`.

## Rotas

| Método e endereço | Função |
|---|---|
| `GET /` | Abre a loja. |
| `GET /produto/<produto_id>` | Abre os detalhes da camisa. |
| `GET /usuarios/<usuario_id>` | Abre o perfil e as camisas do usuário. |
| `GET /api/produtos?pagina=1&por_pagina=8` | Lista camisas com paginação. Aceita também `busca` e `estado`. |
| `GET /api/produtos/busca/<termo>?pagina=1&por_pagina=8` | Busca camisas por título ou descrição, com paginação. |
| `GET /api/produtos/<produto_id>` | Retorna os dados de uma camisa. |
| `GET /api/usuarios/busca/<termo>` | Busca usuários pelo nome. |
| `GET /api/usuarios/<usuario_id>` | Retorna usuário e camisas publicadas por ele. |

As rotas parametrizadas recebem o valor no próprio endereço. Nas consultas SQL, os valores são enviados separadamente com `%s`.

