CREATE DATABASE IF NOT EXISTS marketplace_db CHARACTER SET utf8mb4;
USE marketplace_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL
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

SET @has_senha_hash = (
    SELECT COUNT(*)
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'usuarios'
      AND COLUMN_NAME = 'senha_hash'
);
SET @add_senha_hash = IF(
    @has_senha_hash = 0,
    'ALTER TABLE usuarios ADD COLUMN senha_hash VARCHAR(255) NULL',
    'SELECT 1'
);
PREPARE migration FROM @add_senha_hash;
EXECUTE migration;
DEALLOCATE PREPARE migration;

DELETE FROM produtos
WHERE usuario_id IN (
    SELECT id
    FROM usuarios
    WHERE email IN ('rafael@email.com', 'geovani@email.com')
);
DELETE FROM usuarios
WHERE email IN ('rafael@email.com', 'geovani@email.com');
