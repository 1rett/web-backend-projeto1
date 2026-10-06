# Arquibancada — marketplace de camisas

Projeto da disciplina de Programação Web Back-End. A aplicação usa Flask para servir a interface e a API JSON, e MySQL para armazenar usuários e produtos.

## Funcionalidades

- Pesquisa de produtos por título ou descrição, com paginação.
- Pesquisa por termo em uma rota parametrizada.
- Filtro de produtos por categoria.
- Consulta de produto individual.
- Perfil de usuário com seus produtos publicados.
- Interface web que consulta a API para exibir a loja, detalhes de produto e perfis.
- Tela de login demonstrativa: contas ficam somente no armazenamento local do navegador; não é autenticação real nem grava usuários no banco.

## Tecnologias

- Python 3.10 ou superior
- Flask
- MySQL
- `mysql-connector-python`
- HTML, CSS e JavaScript

## Organização do projeto

```text
.
├── app.py
├── controllers/       # Trata os pedidos e prepara as respostas
├── database/          # Conexão e script de criação do banco
├── models/            # Consultas ao MySQL
├── routes/            # Rotas da API organizadas em Blueprints
├── static/            # CSS e JavaScript do navegador
└── templates/         # Páginas HTML servidas pelo Flask
```

O arquivo `.gitignore` exclui o ambiente virtual, caches de Python e arquivos locais de ambiente.

## Configuração e execução

1. Crie e ative um ambiente virtual e instale as dependências:

   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

2. Inicie o MySQL e execute `database/banco.sql` no MySQL Workbench.
3. Informe as credenciais do MySQL no terminal integrado do VS Code. Exemplo:

   ```powershell
   $env:MYSQL_HOST = "localhost"
   $env:MYSQL_PORT = "3306"
   $env:MYSQL_USER = "root"
   $env:MYSQL_PASSWORD = "sua-senha-local"
   $env:MYSQL_DATABASE = "marketplace_db"
   ```

   As variáveis valem para esse terminal; defina-as novamente ao abrir outro. Não coloque senhas reais em arquivos versionados.
4. Na pasta do projeto, inicie o servidor no mesmo terminal:

   ```powershell
   python app.py
   ```

5. Abra `http://127.0.0.1:5000`.

O script SQL cria as tabelas, mas não insere usuários nem produtos de demonstração. Para a loja exibir conteúdo, cadastre registros de usuários e produtos no MySQL; cada produto precisa referenciar um `usuario_id` existente. O script pode ser executado novamente sem apagar os dados existentes.

## API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/produtos?busca=palmeiras&pagina=1&por_pagina=8` | Pesquisa produtos e retorna os metadados da paginação |
| `GET` | `/api/produtos/busca/palmeiras?pagina=1` | Pesquisa por termo usando parâmetro de rota |
| `GET` | `/api/produtos?categoria=Times%20de%20SP` | Filtra produtos por categoria |
| `GET` | `/api/produtos/1` | Consulta um produto |
| `GET` | `/api/usuarios/1` | Consulta o perfil do usuário e seus produtos |

As respostas da API usam JSON. Uma busca de produtos retorna `busca`, `pagina`, `por_pagina`, `categoria`, `total`, `total_paginas` e `produtos`.
