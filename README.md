# Arquibancada — marketplace de camisas

Projeto da disciplina de Programação Web Back-End. A aplicação usa Flask para servir a interface e a API JSON, e MySQL para armazenar usuários, produtos e estoque.

## Funcionalidades

- Pesquisa de produtos por título ou descrição, com paginação.
- Pesquisa por termo em uma rota parametrizada.
- Filtro de camisas por estado.
- Consulta de produto individual.
- Perfil de usuário com seus produtos publicados.
- Interface web que consulta a API para exibir a loja, detalhes de produto e perfis.
- Catálogo ilustrativo das 20 equipes da Série A do Brasileirão 2026, agrupadas pelos estados.
- Quatro contas fixas de vendedor no MySQL; o cadastro adicional é apenas demonstrativo e fica no navegador.
- ID e estoque consultados no MySQL; o carrinho de demonstração impede selecionar mais unidades do que o estoque informado.

As contas fixas do catálogo são Rafael Rett (`rafaelrett@gmail.com`), Geovani Kloche (`geovaniklocher@gmail.com`), Willian Watanabe (`willianwatanabe@gmail.com`) e Neymar Junior (`neymarjr@gmail.com`). Os IDs são gerados pelo MySQL e não aparecem como identificador da conta na interface.

O catálogo fica organizado por estado: SP (Corinthians, Mirassol, Palmeiras, Red Bull Bragantino, Santos e São Paulo); RJ (Botafogo, Flamengo, Fluminense e Vasco); MG (Atlético Mineiro e Cruzeiro); BA (Bahia e Vitória); PR (Athletico Paranaense e Coritiba); RS (Grêmio e Internacional); PA (Remo); SC (Chapecoense).

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

2. Inicie o MySQL e execute `database/banco.sql` no MySQL Workbench. O script cria as tabelas ou adiciona as colunas necessárias às tabelas existentes, preservando os registros.
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

5. Em outro terminal do VS Code, ative o ambiente, mantenha as variáveis do MySQL configuradas e crie as contas e o catálogo:

   ```powershell
   .\.venv\Scripts\Activate.ps1
   python -m database.seed_catalogo
   ```

   Na primeira execução, o programa gera uma senha temporária diferente para cada conta e a mostra no terminal. Guarde essas senhas: o banco armazena somente hashes, e o programa não as exibirá de novo. A mesma rotina inclui os produtos que ainda não existem e não altera o estoque de produtos já cadastrados.
6. Inicie o servidor no terminal configurado:

   ```powershell
   python app.py
   ```

7. Abra `http://127.0.0.1:5000`.

O script de catálogo atribui cinco equipes a cada vendedor fixo. Os preços (R$ 249,90) e estoques iniciais (12 unidades) são dados fictícios para a demonstração. As camisas são desenhos ilustrativos em SVG, não imagens oficiais dos uniformes. O estoque é lido do MySQL e limita o carrinho demonstrativo; finalizar a compra ainda não reserva nem reduz estoque no banco.

Na tela `/login`, os quatro vendedores entram com e-mail e senha temporária. A opção “Sou novo aqui” cria apenas uma conta fictícia no navegador e não adiciona um usuário ao MySQL.

## API

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/produtos?busca=palmeiras&pagina=1&por_pagina=8` | Pesquisa produtos, estoque e metadados da paginação |
| `GET` | `/api/produtos/busca/palmeiras?pagina=1` | Pesquisa por termo usando parâmetro de rota |
| `GET` | `/api/produtos?estado=SP` | Filtra produtos por estado |
| `GET` | `/api/produtos/1` | Consulta um produto |
| `GET` | `/api/usuarios/1` | Consulta o perfil do usuário e seus produtos |
| `POST` | `/api/auth/login` | Autentica uma das quatro contas fixas |
| `GET` | `/api/auth/me` | Consulta a sessão autenticada |
| `POST` | `/api/auth/logout` | Encerra a sessão |

As respostas da API usam JSON. Uma busca de produtos retorna `busca`, `pagina`, `por_pagina`, `estado`, `total`, `total_paginas` e `produtos`.
