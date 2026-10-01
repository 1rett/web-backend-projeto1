CREATE DATABASE IF NOT EXISTS marketplace_db;
USE marketplace_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50),
    imagem_url VARCHAR(255),
    usuario_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

INSERT INTO usuarios (nome, email) VALUES
('Rafael Rett', 'rafael@email.com'),
('Geovani Kloche', 'geovani@email.com');

INSERT INTO produtos (titulo, descricao, preco, categoria, imagem_url, usuario_id) VALUES
('Camisa Palmeiras', 'Camisa de futebol do Palmeiras.', 249.90, 'Times de SP', 'https://example.com/palmeiras.jpg', 1),
('Camisa Corinthians', 'Camisa de futebol do Corinthians.', 249.90, 'Times de SP', 'https://example.com/corinthians.jpg', 1),
('Camisa São Paulo', 'Camisa de futebol do São Paulo.', 249.90, 'Times de SP', 'https://example.com/sao-paulo.jpg', 1),
('Camisa Santos', 'Camisa de futebol do Santos.', 249.90, 'Times de SP', 'https://example.com/santos.jpg', 1),
('Camisa Flamengo', 'Camisa de futebol do Flamengo.', 249.90, 'Times do RJ', 'https://example.com/flamengo.jpg', 2),
('Camisa Vasco', 'Camisa de futebol do Vasco.', 249.90, 'Times do RJ', 'https://example.com/vasco.jpg', 2),
('Camisa Fluminense', 'Camisa de futebol do Fluminense.', 249.90, 'Times do RJ', 'https://example.com/fluminense.jpg', 2),
('Camisa Botafogo', 'Camisa de futebol do Botafogo.', 249.90, 'Times do RJ', 'https://example.com/botafogo.jpg', 2);
