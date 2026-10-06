# 🚀 API Web Back-End — [Nome do Seu Projeto]

> **Disciplina:** Programação Web Back-End  
> **Temática Escolhida:** [Ex: E-commerce / Micro-blogging / Armazenamento de Fotos / etc.]  
> **Equipe:**  
> - Rafael Rett Alberini - [1rett]  
> - Geovani Kloche Miter - [geovaniklochemiter-glitch]  

---

## 📋 Sobre o Projeto

Este projeto consiste no desenvolvimento de uma Web API JSON desenvolvida para a disciplina de Programação Web Back-End. A aplicação segue o padrão arquitetural **MVC (Model-View-Controller)** e utiliza **Python com Flask** no servidor HTTP e **MySQL** como banco de dados relacional, além de uma página Front-End simples para consumo dos dados.

### 🎯 Funcionalidades Principais
- **Busca de Conteúdo:** Rota parametrizada com suporte a termos de busca (`String`) e paginação.
- **Perfil de Usuário:** Rota de busca de usuários com exibição do conjunto de itens/conteúdos vinculados a ele.
- **Interface Front-End:** Página simples em HTML/JS para consultar e visualizar as rotas da API.
- **Autenticação:** Cadastro com nome, e-mail e senha, login, sessão e logout. As senhas são armazenadas com hash no MySQL.

### 🔐 Cadastro e acesso

Abra `/login` para criar uma conta ou entrar. O cadastro cria a conta no banco e inicia a sessão automaticamente. A senha precisa ter pelo menos 8 caracteres.

As rotas de autenticação são `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` e `POST /api/auth/logout`. Configure o banco local em `database/conexao.py` e execute `database/banco.sql`; o script prepara a coluna de hash de senha e remove os registros de demonstração antigos nomeados no próprio script.

---

## 🛠️ Tecnologias Utilizadas

- **Linguagem:** Python 3.10+
- **Framework Web:** Flask
- **Banco de Dados:** MySQL
- **Driver de Conexão:** `mysql-connector-python`
- **Front-End:** HTML5, CSS3, JavaScript (Fetch API)

---

## 📂 Estrutura do Projeto (Padrão MVC)

```text
projeto/
├── app/
│   ├── controllers/    # Camada de controle (Rotas e regras da API)
│   ├── models/         # Camada de dados (Queries e integração MySQL)
│   ├── static/         # Arquivos estáticos do Front-End (JS/CSS)
│   └── templates/      # Páginas HTML
├── .gitignore          # Arquivos e pastas ignorados pelo Git
├── requirements.txt    # Dependências do projeto Python
├── run.py              # Ponto de entrada do servidor Flask
└── schema.sql          # Script de criação do Banco de Dados