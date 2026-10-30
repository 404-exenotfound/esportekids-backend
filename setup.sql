-- ============================================================
-- Schema PostgreSQL — Quiz SaaS Escolar
-- ============================================================

-- Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id         SERIAL PRIMARY KEY,
  -- Nome escolhido numa lista fixa (ver src/routes/user/nomes.js),
  -- com número quando repete: Pedro, Pedro2, Pedro3...
  nome       VARCHAR(255) UNIQUE NOT NULL,
  senha      VARCHAR(255) NOT NULL,
  cargo      VARCHAR(10)  NOT NULL DEFAULT 'cliente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Login compara sem diferenciar maiúscula/minúscula
CREATE INDEX IF NOT EXISTS idx_usuarios_nome_lower ON usuarios(LOWER(nome));

-- Materias
CREATE TABLE IF NOT EXISTS materias (
  id    SERIAL PRIMARY KEY,
  nome  VARCHAR(100) NOT NULL,
  icone VARCHAR(50)  NOT NULL
);

-- Perguntas
CREATE TABLE IF NOT EXISTS perguntas (
  id         SERIAL PRIMARY KEY,
  materia_id INT NOT NULL REFERENCES materias(id),
  enunciado  TEXT NOT NULL
);

-- Alternativas (5 por pergunta, uma correta)
CREATE TABLE IF NOT EXISTS alternativas (
  id          SERIAL PRIMARY KEY,
  pergunta_id INT NOT NULL REFERENCES perguntas(id) ON DELETE CASCADE,
  texto       TEXT    NOT NULL,
  correta     BOOLEAN NOT NULL DEFAULT FALSE
);

-- Partidas
CREATE TABLE IF NOT EXISTS partidas (
  id              SERIAL PRIMARY KEY,
  usuario_id      INT NOT NULL REFERENCES usuarios(id),
  pontuacao       INT NOT NULL DEFAULT 0,
  acertos         INT NOT NULL DEFAULT 0,
  total_perguntas INT NOT NULL DEFAULT 10,
  created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Materias escolhidas por partida
CREATE TABLE IF NOT EXISTS partida_materias (
  partida_id INT NOT NULL REFERENCES partidas(id) ON DELETE CASCADE,
  materia_id INT NOT NULL REFERENCES materias(id),
  PRIMARY KEY (partida_id, materia_id)
);

-- ============================================================
-- Seed — Materias
-- ============================================================
INSERT INTO materias (nome, icone) VALUES
  ('Historia',  'ClockIcon'),
  ('Ciencias',  'DnaIcon'),
  ('Geografia', 'MapPinIcon'),
  ('Gerais',    'BookOpenIcon'),
  ('Cinema',    'FilmReelIcon')
ON CONFLICT DO NOTHING;

-- ============================================================
-- Seed — Perguntas e Alternativas
-- ============================================================

-- HISTORIA (materia_id = 1)
WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (1, 'Em que ano o Brasil foi descoberto pelos portugueses?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['1500','1498','1502','1488','1510']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (1, 'Quem proclamou a Independência do Brasil?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Dom Pedro I','Dom Pedro II','Tiradentes','Marquês de Pombal','José Bonifácio']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (1, 'Em que ano foi abolida a escravidão no Brasil?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['1888','1889','1870','1850','1900']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (1, 'Qual foi o primeiro presidente do Brasil república?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Deodoro da Fonseca','Floriano Peixoto','Campos Sales','Prudente de Morais','Getúlio Vargas']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (1, 'A Revolução Francesa ocorreu em qual ano?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['1789','1776','1804','1815','1848']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (1, 'Qual país lançou as primeiras bombas atômicas na Segunda Guerra?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Estados Unidos','Alemanha','União Soviética','Reino Unido','Japão']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (1, 'Em que ano caiu o Muro de Berlim?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['1989','1991','1985','1975','1993']), unnest(ARRAY[true,false,false,false,false]) FROM p;

-- CIENCIAS (materia_id = 2)
WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (2, 'Qual é o símbolo químico do ouro?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Au','Ag','Fe','Cu','Go']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (2, 'Quantos cromossomos tem uma célula humana normal?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['46','23','48','44','92']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (2, 'Qual organela é responsável pela respiração celular?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Mitocôndria','Ribossomo','Núcleo','Vacúolo','Cloroplasto']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (2, 'Qual é a fórmula química da água?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['H2O','CO2','NaCl','H2O2','O2']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (2, 'Qual lei descreve a relação entre pressão e volume de um gás?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Lei de Boyle','Lei de Newton','Lei de Ohm','Lei de Faraday','Lei de Coulomb']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (2, 'Qual é o maior órgão do corpo humano?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Pele','Fígado','Pulmão','Intestino','Cérebro']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (2, 'DNA significa:') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Ácido Desoxirribonucleico','Ácido Ribonucleico','Adenosina Trifosfato','Ácido Desoxiribossômico','Dinucleotídeo Adenina']), unnest(ARRAY[true,false,false,false,false]) FROM p;

-- GEOGRAFIA (materia_id = 3)
WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (3, 'Qual é o maior país do mundo em extensão territorial?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Rússia','Canadá','Brasil','Estados Unidos','China']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (3, 'Qual é o rio mais longo do mundo?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Nilo','Amazonas','Yangtzé','Mississippi','Congo']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (3, 'Qual é o deserto mais quente do mundo?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Saara','Gobi','Atacama','Arábico','Kalahari']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (3, 'Qual é a capital da Austrália?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Camberra','Sydney','Melbourne','Brisbane','Perth']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (3, 'Quantos países fazem fronteira com o Brasil?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['10','8','9','11','7']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (3, 'Qual continente tem o maior número de países?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['África','Ásia','Europa','América','Oceania']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (3, 'Qual é a montanha mais alta do mundo?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Everest','K2','Kangchenjunga','Makalu','Lhotse']), unnest(ARRAY[true,false,false,false,false]) FROM p;

-- GERAIS (materia_id = 4)
WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (4, 'Quantos lados tem um hexágono?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['6','5','7','8','4']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (4, 'Qual é o idioma mais falado no mundo?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Mandarim','Inglês','Espanhol','Hindi','Árabe']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (4, 'Quem escreveu Dom Casmurro?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Machado de Assis','José de Alencar','Eça de Queirós','Lima Barreto','Aluísio Azevedo']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (4, 'Qual é o elemento mais abundante na crosta terrestre?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Oxigênio','Silício','Alumínio','Ferro','Cálcio']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (4, 'Em que ano foi fundada a ONU?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['1945','1939','1950','1919','1960']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (4, 'Qual é o planeta mais próximo do Sol?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Mercúrio','Vênus','Terra','Marte','Júpiter']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (4, 'Quantos ossos tem o corpo humano adulto?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['206','208','210','204','212']), unnest(ARRAY[true,false,false,false,false]) FROM p;

-- CINEMA (materia_id = 5)
WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (5, 'Qual filme ganhou o Oscar de Melhor Filme em 1994?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Forrest Gump','Pulp Fiction','O Rei Leão','Shawshank','Quiz Show']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (5, 'Quem dirigiu o filme "O Poderoso Chefão"?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Francis Ford Coppola','Martin Scorsese','Steven Spielberg','Stanley Kubrick','Sergio Leone']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (5, 'Em qual filme aparece a frase "Que a Força esteja com você"?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Star Wars','Star Trek','Dune','Avatar','Interstellar']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (5, 'Qual ator interpretou o Coringa em "Batman: O Cavaleiro das Trevas"?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Heath Ledger','Jack Nicholson','Joaquin Phoenix','Jared Leto','Mark Hamill']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (5, 'Qual é o filme de animação mais rentável de todos os tempos?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['O Rei Leão (2019)','Frozen II','Incredibles 2','Minions','Toy Story 4']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (5, 'Qual estúdio produziu a saga "Velozes e Furiosos"?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Universal','Warner','Paramount','Disney','Sony']), unnest(ARRAY[true,false,false,false,false]) FROM p;

WITH p AS (INSERT INTO perguntas (materia_id, enunciado) VALUES (5, 'Quem interpretou o personagem Jack em "Titanic" (1997)?') RETURNING id)
INSERT INTO alternativas (pergunta_id, texto, correta) SELECT id, unnest(ARRAY['Leonardo DiCaprio','Brad Pitt','Tom Hanks','Johnny Depp','Matt Damon']), unnest(ARRAY[true,false,false,false,false]) FROM p;

-- ============================================================
-- Seed — Materias do EsporteKids
-- Idempotente: pode rodar de novo sem duplicar. O front casa
-- o esporte com a matéria pelo nome.
-- ============================================================
INSERT INTO materias (nome, icone)
SELECT v.nome, v.icone
FROM (VALUES
  ('Basquete',  '🏀'),
  ('Futebol',   '⚽'),
  ('Atletismo', '🏃'),
  ('Ping Pong', '🏓'),
  ('Boliche',   '🎳')
) AS v(nome, icone)
WHERE NOT EXISTS (SELECT 1 FROM materias m WHERE m.nome = v.nome);
