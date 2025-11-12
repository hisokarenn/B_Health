--- Tabela Pessoas
CREATE TABLE IF NOT EXISTS pessoas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cns VARCHAR(15) UNIQUE NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR (100) NOT NULL
    
);

-- Tabela de Tipos de Vacina
CREATE TABLE IF NOT EXISTS vacinas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    fabricante VARCHAR(100),
    doses_recomendadas INTEGER,
    intervalo_dias INTEGER
);

-- Tabela de Unidades de Saúde
CREATE TABLE IF NOT EXISTS unidades_saude (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
    -- Endereço e outras informações podem ser adicionadas aqui
);

-- Tabela de Doses Aplicadas
CREATE TABLE IF NOT EXISTS doses_aplicadas (
    id SERIAL PRIMARY KEY,
    
    -- Chaves Estrangeiras
    paciente_id INTEGER REFERENCES pessoas(id) NOT NULL, -- Liga ao paciente
    vacina_id INTEGER REFERENCES vacinas(id) NOT NULL,       -- Liga à vacina aplicada
    unidade_saude_id INTEGER REFERENCES unidades_saude(id) NOT NULL, -- Liga ao local
    
    -- Dados da Dose
    data_aplicacao DATE NOT NULL,
    dose_numero INTEGER NOT NULL,          -- Representa a 'dose' na saída
    lote VARCHAR(50),
    profissional_responsavel VARCHAR(100)  
);

-- Tabela CAMPANHAS
CREATE TABLE IF NOT EXISTS campanhas (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,                           
    descricao TEXT,
    tipo_vacina VARCHAR(100) NOT NULL,                      
    publico_alvo VARCHAR(100) NOT NULL,                     
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,                                  
    locais_aplicacao VARCHAR(255)                           
);