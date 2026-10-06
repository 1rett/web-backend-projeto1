CREATE DATABASE IF NOT EXISTS marketplace_db CHARACTER SET utf8mb4;
USE marketplace_db;

DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS usuarios;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NULL
);

CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(40) NOT NULL UNIQUE,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50),
    estado CHAR(2) NOT NULL,
    imagem_url VARCHAR(255),
    estoque INT NOT NULL DEFAULT 12,
    cor_principal VARCHAR(7) NOT NULL DEFAULT '#0b7a3b',
    cor_secundaria VARCHAR(7) NOT NULL DEFAULT '#ffffff',
    padrao VARCHAR(1) NOT NULL DEFAULT 'v',
    usuario_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

INSERT INTO usuarios (nome, email) VALUES
('Rafael Rett', 'rafaelrett@gmail.com'),
('Geovani Kloche', 'geovaniklocher@gmail.com'),
('Willian Watanabe', 'willianwatanabe@gmail.com'),
('Neymar Junior', 'neymarjr@gmail.com');

INSERT INTO produtos (
    codigo, titulo, descricao, preco, categoria, estado, imagem_url,
    estoque, cor_principal, cor_secundaria, padrao, usuario_id
) VALUES
('BR26-PAL', 'Camisa Palmeiras', 'Camisa de futebol do Palmeiras.', 249.90, 'Times de SP', 'SP', 'https://example.com/palmeiras.jpg', 12, '#087a3b', '#ffffff', 'v', 1),
('BR26-COR', 'Camisa Corinthians', 'Camisa de futebol do Corinthians.', 249.90, 'Times de SP', 'SP', 'https://example.com/corinthians.jpg', 12, '#f7f7f7', '#111111', 'v', 1),
('BR26-MIR', 'Camisa Mirassol', 'Camisa de futebol do Mirassol.', 249.90, 'Times de SP', 'SP', 'https://example.com/mirassol.jpg', 12, '#f4d21f', '#087a3b', 'v', 1),
('BR26-RBB', 'Camisa Red Bull Bragantino', 'Camisa de futebol do Red Bull Bragantino.', 249.90, 'Times de SP', 'SP', 'https://example.com/red-bull-bragantino.jpg', 12, '#f7f7f7', '#d71920', 'v', 1),
('BR26-SAN', 'Camisa Santos', 'Camisa de futebol do Santos.', 249.90, 'Times de SP', 'SP', 'https://example.com/santos.jpg', 12, '#f7f7f7', '#111111', 'v', 1),
('BR26-SAO', 'Camisa São Paulo', 'Camisa de futebol do São Paulo.', 249.90, 'Times de SP', 'SP', 'https://example.com/sao-paulo.jpg', 12, '#f7f7f7', '#d71920', 'h', 2),
('BR26-BOT', 'Camisa Botafogo', 'Camisa de futebol do Botafogo.', 249.90, 'Times do RJ', 'RJ', 'https://example.com/botafogo.jpg', 12, '#111111', '#f7f7f7', 'v', 2),
('BR26-FLA', 'Camisa Flamengo', 'Camisa de futebol do Flamengo.', 249.90, 'Times do RJ', 'RJ', 'https://example.com/flamengo.jpg', 12, '#c8102e', '#111111', 'h', 2),
('BR26-FLU', 'Camisa Fluminense', 'Camisa de futebol do Fluminense.', 249.90, 'Times do RJ', 'RJ', 'https://example.com/fluminense.jpg', 12, '#7a1732', '#087a3b', 'v', 2),
('BR26-VAS', 'Camisa Vasco', 'Camisa de futebol do Vasco.', 249.90, 'Times do RJ', 'RJ', 'https://example.com/vasco.jpg', 12, '#111111', '#f7f7f7', 'h', 2),
('BR26-CAM', 'Camisa Atlético Mineiro', 'Camisa de futebol do Atlético Mineiro.', 249.90, 'Times de MG', 'MG', 'https://example.com/atletico-mineiro.jpg', 12, '#111111', '#f7f7f7', 'v', 3),
('BR26-CRU', 'Camisa Cruzeiro', 'Camisa de futebol do Cruzeiro.', 249.90, 'Times de MG', 'MG', 'https://example.com/cruzeiro.jpg', 12, '#005ca9', '#f7f7f7', 'v', 3),
('BR26-BAH', 'Camisa Bahia', 'Camisa de futebol do Bahia.', 249.90, 'Times da BA', 'BA', 'https://example.com/bahia.jpg', 12, '#f7f7f7', '#005ca9', 'h', 3),
('BR26-VIT', 'Camisa Vitória', 'Camisa de futebol do Vitória.', 249.90, 'Times da BA', 'BA', 'https://example.com/vitoria.jpg', 12, '#c8102e', '#111111', 'h', 3),
('BR26-CAP', 'Camisa Athletico Paranaense', 'Camisa de futebol do Athletico Paranaense.', 249.90, 'Times do PR', 'PR', 'https://example.com/athletico-paranaense.jpg', 12, '#c8102e', '#111111', 'h', 3),
('BR26-CFC', 'Camisa Coritiba', 'Camisa de futebol do Coritiba.', 249.90, 'Times do PR', 'PR', 'https://example.com/coritiba.jpg', 12, '#087a3b', '#f7f7f7', 'v', 4),
('BR26-GRE', 'Camisa Grêmio', 'Camisa de futebol do Grêmio.', 249.90, 'Times do RS', 'RS', 'https://example.com/gremio.jpg', 12, '#087bb5', '#111111', 'h', 4),
('BR26-INT', 'Camisa Internacional', 'Camisa de futebol do Internacional.', 249.90, 'Times do RS', 'RS', 'https://example.com/internacional.jpg', 12, '#c8102e', '#f7f7f7', 'v', 4),
('BR26-REM', 'Camisa Remo', 'Camisa de futebol do Remo.', 249.90, 'Times do PA', 'PA', 'https://example.com/remo.jpg', 12, '#142b63', '#f7f7f7', 'h', 4),
('BR26-CHA', 'Camisa Chapecoense', 'Camisa de futebol da Chapecoense.', 249.90, 'Times de SC', 'SC', 'https://example.com/chapecoense.jpg', 12, '#087a3b', '#f7f7f7', 'v', 4);
