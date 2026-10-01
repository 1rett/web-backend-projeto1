CREATE DATABASE techstore;

USE techstore;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL,
    categoria VARCHAR(50),
    usuario_id INT NOT NULL,

    FOREIGN KEY (usuario_id)
    REFERENCES usuarios(id)
);

INSERT INTO usuarios (nome, email, senha)
VALUES
('Geovani', 'geovani@email.com', '123456'),
('Rafael', 'rafael@email.com', '123456');

INSERT INTO produtos
(nome, descricao, preco, estoque, categoria, usuario_id)
VALUES
('Notebook Lenovo',
 'Notebook para estudos e trabalho',
 2500.00,
 5,
 'Informática',
 1),

('Mouse Gamer',
 'Mouse gamer RGB',
 150.00,
 20,
 'Periféricos',
 1),

('Teclado Mecânico',
 'Teclado mecânico RGB',
 300.00,
 10,
 'Periféricos',
 2);