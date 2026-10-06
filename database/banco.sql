CREATE DATABASE IF NOT EXISTS marketplace_db CHARACTER SET utf8mb4;
USE marketplace_db;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NULL
);

CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(40) NOT NULL UNIQUE,
    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    categoria VARCHAR(50),
    estado CHAR(2) NOT NULL,
    imagem_url VARCHAR(255),
    estoque INT NOT NULL DEFAULT 0,
    cor_principal VARCHAR(7) NOT NULL DEFAULT '#0b7a3b',
    cor_secundaria VARCHAR(7) NOT NULL DEFAULT '#ffffff',
    padrao VARCHAR(1) NOT NULL DEFAULT 'v',
    usuario_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

SET @schema_name = DATABASE();
SET @has_password_hash = (
    SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'usuarios'
      AND COLUMN_NAME = 'senha_hash'
);
SET @migration_sql = IF(
    @has_password_hash = 0,
    'ALTER TABLE usuarios ADD COLUMN senha_hash VARCHAR(255) NULL',
    'SELECT 1'
);
PREPARE migration FROM @migration_sql;
EXECUTE migration;
DEALLOCATE PREPARE migration;

SET @has_cor_principal = (
    SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'produtos'
      AND COLUMN_NAME = 'cor_principal'
);
SET @migration_sql = IF(
    @has_cor_principal = 0,
    'ALTER TABLE produtos ADD COLUMN cor_principal VARCHAR(7) NOT NULL DEFAULT ''#0b7a3b''',
    'SELECT 1'
);
PREPARE migration FROM @migration_sql;
EXECUTE migration;
DEALLOCATE PREPARE migration;

SET @has_cor_secundaria = (
    SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'produtos'
      AND COLUMN_NAME = 'cor_secundaria'
);
SET @migration_sql = IF(
    @has_cor_secundaria = 0,
    'ALTER TABLE produtos ADD COLUMN cor_secundaria VARCHAR(7) NOT NULL DEFAULT ''#ffffff''',
    'SELECT 1'
);
PREPARE migration FROM @migration_sql;
EXECUTE migration;
DEALLOCATE PREPARE migration;

SET @has_padrao = (
    SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'produtos'
      AND COLUMN_NAME = 'padrao'
);
SET @migration_sql = IF(
    @has_padrao = 0,
    'ALTER TABLE produtos ADD COLUMN padrao VARCHAR(1) NOT NULL DEFAULT ''v''',
    'SELECT 1'
);
PREPARE migration FROM @migration_sql;
EXECUTE migration;
DEALLOCATE PREPARE migration;

SET @has_codigo = (
    SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'produtos'
      AND COLUMN_NAME = 'codigo'
);
SET @migration_sql = IF(
    @has_codigo = 0,
    'ALTER TABLE produtos ADD COLUMN codigo VARCHAR(40) NULL',
    'SELECT 1'
);
PREPARE migration FROM @migration_sql;
EXECUTE migration;
DEALLOCATE PREPARE migration;

UPDATE produtos
SET codigo = CONCAT('LEGACY-', id)
WHERE codigo IS NULL OR codigo = '';

SET @has_codigo_index = (
    SELECT COUNT(*) FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'produtos'
      AND COLUMN_NAME = 'codigo'
      AND NON_UNIQUE = 0
);
SET @migration_sql = IF(
    @has_codigo_index = 0,
    'ALTER TABLE produtos ADD UNIQUE INDEX uq_produtos_codigo (codigo)',
    'SELECT 1'
);
PREPARE migration FROM @migration_sql;
EXECUTE migration;
DEALLOCATE PREPARE migration;

ALTER TABLE produtos MODIFY COLUMN codigo VARCHAR(40) NOT NULL;

SET @has_estado = (
    SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'produtos'
      AND COLUMN_NAME = 'estado'
);
SET @migration_sql = IF(
    @has_estado = 0,
    'ALTER TABLE produtos ADD COLUMN estado CHAR(2) NOT NULL DEFAULT ''SP''',
    'SELECT 1'
);
PREPARE migration FROM @migration_sql;
EXECUTE migration;
DEALLOCATE PREPARE migration;

UPDATE produtos SET estado = 'RJ' WHERE categoria = 'Times do RJ';

SET @has_estoque = (
    SELECT COUNT(*) FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = @schema_name
      AND TABLE_NAME = 'produtos'
      AND COLUMN_NAME = 'estoque'
);
SET @migration_sql = IF(
    @has_estoque = 0,
    'ALTER TABLE produtos ADD COLUMN estoque INT NOT NULL DEFAULT 0',
    'SELECT 1'
);
PREPARE migration FROM @migration_sql;
EXECUTE migration;
DEALLOCATE PREPARE migration;
