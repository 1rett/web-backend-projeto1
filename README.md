# Arquibancada

Marketplace demonstrativo de camisas de futebol. O projeto usa Flask para as páginas e a API, e MySQL para guardar usuários e produtos.

## O que o projeto faz

- Exibe e pesquisa camisas por nome ou descrição, com filtro por estado e paginação.
- Mostra os detalhes de uma camisa e o vendedor responsável.
- Busca o perfil do usuário pelo ID e lista as camisas ligadas a ele.
- Mostra preço, estoque e vendedor de cada camisa.

O catálogo inicial tem 20 camisas, quatro vendedores e cinco camisas por vendedor. Os produtos e preços são fictícios. A interface é intencionalmente simples para destacar a API, as consultas e a relação entre usuários e produtos.

## Como explicar a organização

Quando alguém abre uma página ou faz uma busca, o caminho é:

```text
Navegador → routes → controllers → models → MySQL
                       ↓
                 resposta JSON
```

- `routes/`: define os endereços da API.
- `controllers/`: valida parâmetros, chama consultas e monta respostas.
- `models/`: executa consultas SQL.
- `database/`: configura a conexão, cria e preenche o banco.
- `templates/` e `static/`: páginas HTML, estilos e JavaScript do navegador.
- `app.py`: inicia o Flask e registra as páginas e rotas.

Exemplo: a loja pede `/api/produtos`; a rota chama o controlador, que consulta o modelo, e o modelo busca os produtos no MySQL. Para um perfil, a API recebe o ID em `/api/usuarios/1` e retorna o usuário e os produtos cujo `usuario_id` é `1`.

## Resumo para apresentar

“O Arquibancada é um marketplace demonstrativo feito com Flask e MySQL. O usuário pode pesquisar camisas, filtrar por estado, ver o perfil de cada vendedor pelo ID e consultar as camisas ligadas a ele. As rotas recebem as requisições, os controladores organizam a resposta e os modelos consultam o banco.”

## Preparar e iniciar

Requisitos: Python 3.10 ou superior, MySQL Server e MySQL Workbench.

1. No terminal do VS Code, crie e ative um ambiente virtual e instale as dependências:

   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

2. No MySQL Workbench, conecte-se ao servidor e execute `database/banco.sql`.

   **Atenção:** esse script apaga e recria as tabelas `produtos` e `usuarios`, inserindo os quatro usuários e as 20 camisas iniciais.

3. No mesmo terminal do VS Code, configure a conexão usando os dados do Workbench:

   ```powershell
   $env:MYSQL_HOST = "127.0.0.1"
   $env:MYSQL_PORT = "3306"
   $env:MYSQL_USER = "root"
   $env:MYSQL_PASSWORD = "sua-senha-do-MySQL"
   $env:MYSQL_DATABASE = "marketplace_db"
   ```

   As variáveis valem apenas para esse terminal. Não salve uma senha real no código ou em arquivos versionados.

4. Gere senhas temporárias para as contas do catálogo:

   ```powershell
   python -m database.seed_catalogo
   ```

   Guarde as senhas mostradas no terminal. Como as contas são fictícias, as senhas ficam em texto simples no banco. Essa rotina também pode completar produtos ausentes sem duplicar os já cadastrados.

   Para gerar quatro senhas temporárias novas depois, execute `python -m database.seed_catalogo --reset-senhas`. O comando atualiza as senhas das quatro contas e mostra os novos valores uma única vez.

5. Inicie o site:

   ```powershell
   python app.py
   ```

   Abra `http://127.0.0.1:5000`. Para a loja exibir os produtos, mantenha o MySQL ligado e inicie o Flask no mesmo terminal em que configurou as variáveis.

Se o PowerShell bloquear a ativação do ambiente, use `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` no terminal atual e tente ativar novamente.

## Endereços principais

| Endereço | O que mostra |
|---|---|
| `/` | Loja, pesquisa de camisa e busca de usuário por ID |
| `/produto/1` | Detalhes da camisa de ID 1 |
| `/usuarios/1` | Perfil do usuário de ID 1 e suas camisas |
| `/api/produtos?busca=Palmeiras` | Pesquisa de camisas pela API |
| `/api/produtos?estado=SP` | Camisas filtradas por estado |
| `/api/usuarios/1` | Dados do usuário e produtos associados em JSON |

O login usa as quatro contas do catálogo. As senhas são fictícias e ficam em texto simples no banco; não reutilize esse modelo com senhas reais.
