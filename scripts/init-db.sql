-- scripts/init-db.sql
CREATE TABLE IF NOT EXISTS pessoas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cns VARCHAR(15) UNIQUE NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR (100) NOT NULL
    
);

INSERT INTO pessoas (nome, cns, cpf, email, senha) VALUES ('Aylla', '123456789', '54321', 'aylla@gmail.com', 'aylla123') ON CONFLICT (email) DO NOTHING;

-- 1. Tabela de Tipos de Vacina (Baseada na classe Vacina)
CREATE TABLE IF NOT EXISTS vacinas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    fabricante VARCHAR(100),
    doses_recomendadas INTEGER,
    intervalo_dias INTEGER
);

-- 2. Tabela de Unidades de Saúde (Baseada na classe UnidadeSaude)
CREATE TABLE IF NOT EXISTS unidades_saude (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
    -- Endereço e outras informações podem ser adicionadas aqui
);

-- 3. Tabela de Doses Aplicadas (Histórico - Baseada na classe Dose)
CREATE TABLE IF NOT EXISTS doses_aplicadas (
    id SERIAL PRIMARY KEY,
    
    -- Chaves Estrangeiras
    paciente_id INTEGER REFERENCES pessoas(id) NOT NULL, -- Liga ao paciente
    vacina_id INTEGER REFERENCES vacinas(id) NOT NULL,       -- Liga à vacina aplicada
    unidade_saude_id INTEGER REFERENCES unidades_saude(id) NOT NULL, -- Liga ao local
    
    -- Dados da Dose (RF03 e Diagrama de Classes)
    data_aplicacao DATE NOT NULL,
    dose_numero INTEGER NOT NULL,          -- Representa a 'dose' na saída
    lote VARCHAR(50),
    profissional_responsavel VARCHAR(100)  
);

-- Adição da Tabela CAMPANHAS (Baseada no Diagrama de Classes)
CREATE TABLE IF NOT EXISTS campanhas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,                           -- RF04
    descricao TEXT,
    tipo_vacina VARCHAR(100) NOT NULL,                      -- RF04
    publico_alvo VARCHAR(100) NOT NULL,                     -- RF04
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,                                 -- RF04 (Período de validade)
    locais_aplicacao VARCHAR(255)                           -- RF04
    -- Simplificado: Usamos VARCHAR para evitar relacionamentos JOINs complexos aqui.
);

-- Inserção de Dados de Exemplo para Campanhas
INSERT INTO campanhas (titulo, descricao, tipo_vacina, publico_alvo, data_inicio, data_fim, locais_aplicacao)
VALUES 
('Campanha Nacional de Influenza', 'Vacinação contra a gripe sazonal.', 'Influenza', 'Idosos (+60), Crianças (6m - 5a), Gestantes', '2025-03-01', '2025-05-30', 'Todas as UBS'),
('Atualização Caderneta (Crianças)', 'Verificação e aplicação de doses atrasadas.', 'Todas', 'Crianças até 10 anos', '2025-10-01', '2025-12-31', 'UBS e Postos Móveis');