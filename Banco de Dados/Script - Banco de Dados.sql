-- CRIANDO BANCO DE DADOS E SELECIONANDO ELE
CREATE DATABASE percussao_afro;

USE percussao_afro;

-- CRIANDO TABELAS
CREATE TABLE usuario(
	idUsuario INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100)NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    dtCadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pergunta(
	idPergunta INT PRIMARY KEY AUTO_INCREMENT,
    enunciado VARCHAR(500) NOT NULL,
    alternativaA VARCHAR(255) NOT NULL,
    alternativaB VARCHAR(255) NOT NULL,
    alternativaC VARCHAR(255) NOT NULL,
    alternativaD VARCHAR(255) NOT NULL,
    respostaCorreta CHAR(1) NOT NULL,
    tema VARCHAR(50) NOT NULL
);

CREATE TABLE tentativas_quiz(
    idTentativa INT PRIMARY KEY AUTO_INCREMENT,
    fkUsuario INT NOT NULL,
    acertos INT NOT NULL,
    erros INT NOT NULL,
    dtTentativa DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tentativa_usuario FOREIGN KEY (fkUsuario) 
        REFERENCES usuario(idUsuario)
);
    
CREATE TABLE resposta_quiz(
    idResposta INT PRIMARY KEY AUTO_INCREMENT,
    fkTentativa INT NOT NULL,
    fkPergunta INT NOT NULL,
    alternativaEscolhida CHAR(1) NOT NULL,
    correta TINYINT(1) NOT NULL,
    CONSTRAINT fk_resposta_tentativa FOREIGN KEY (fkTentativa) 
        REFERENCES tentativas_quiz(idTentativa),
    CONSTRAINT fk_resposta_pergunta FOREIGN KEY (fkPergunta) 
        REFERENCES pergunta(idPergunta),
    CONSTRAINT uq_tentativa_pergunta UNIQUE (fkTentativa, fkPergunta)
);


-- INSERTS
INSERT INTO pergunta (enunciado, alternativaA, alternativaB, alternativaC, alternativaD, respostaCorreta, tema) VALUES
('Qual instrumento de cordas percutidas é considerado o coração e o comandante da roda de capoeira?',
 'Atabaque', 'Berimbau', 'Cavaquinho', 'Alfaia', 'B', 'capoeira'),
 
('O Maracatu Nação (ou de Baque Virado) é uma manifestação cultural tradicionalmente associada a qual estado brasileiro?',
 'Bahia', 'Rio de Janeiro', 'Pernambuco', 'Maranhão', 'C', 'maracatu'),
 
('No acervo, alguns instrumentos não são classificados estritamente como percussão, mas são fundamentais para as manifestações. Qual das alternativas abaixo apresenta um instrumento catalogado como "Não é percussão"?',
 'Cavaquinho', 'Surdo', 'Agogô', 'Pandeiro', 'A', 'samba'),
 
('Qual é a principal função da cuíca nas baterias de samba?',
 'Marcar o som grave principal do surdo na linha de frente.',
 'Produzir um som de fricção característico que lembra um "gemido" ou uma voz.',
 'Conduzir o cortejo real através de batidas secas com esteira.',
 'Executar toques agudos com auxílio de uma vareta de metal nas campânulas.',
 'B', 'samba'),
 
('Sobre a Capoeira Angola, sistematizada e preservada por Mestre Pastinha a partir da década de 1940, qual característica é correta?',
 'Possui postura totalmente ereta com saltos e acrobacias velozes.',
 'Utiliza uma bateria muito enxuta composta apenas por um berimbau e dois pandeiros.',
 'É um estilo contemporâneo que mistura o caratê com o maracatu.',
 'O jogo acontece mais próximo ao chão, com foco na estratégia, malícia (mandinga) e teatralidade.',
 'D', 'capoeira'),
 
('Qual é o tambor grave de corpo cilíndrico em madeira que se destaca como o instrumento mais marcante do Maracatu Nação?',
 'Atabaque', 'Tantã', 'Alfaia', 'Repique', 'C', 'maracatu'),
 
('Como costuma se estruturar o conjunto de atabaques tradicionais de acordo com seus tamanhos e alturas de som?',
 'Rum (grave), rumpi (médio) e lê (agudo).',
 'Gunga (grave), médio e viola (agudo).',
 'Primeira, segunda e terceira.',
 'Grave, tenor e soprano.',
 'A', 'umbanda'),
 
('No contexto do Samba de Roda do Recôncavo Baiano, qual instrumento improvisado e tradicional é formado por um objeto de louça/metal e uma faca?',
 'Reco-reco de bambu', 'Agogô duplo', 'Caxixi e dobrão', 'Prato e faca', 'D', 'samba'),
 
('Sobre a Umbanda e sua relação com a música, qual afirmativa condiz com a proposta apresentada no acervo?',
 'Existe uma única configuração ritual rígida e padronizada igual em todos os terreiros do Brasil.',
 'Os fundamentos, a liturgia e os instrumentos utilizados podem variar entre terreiros e vertentes.',
 'A Umbanda não utiliza nenhum tipo de canto ou percussão em suas cerimônias.',
 'Os atabaques são proibidos por liturgia em todas as casas de Umbanda.',
 'B', 'umbanda'),
 
('O que caracteriza o instrumento chamado "Gonguê" utilizado no Maracatu?',
 'É um tambor cilíndrico friccionado por uma vareta interna.',
 'Trata-se de um arco musical de origem africana com cabaça.',
 'É um sino de ferro, geralmente duplo, percutido com baqueta para conduzir o baque.',
 'É um chocalho de cestaria trançada preenchido com sementes.',
 'C', 'maracatu');


-- SELECTS
 SELECT * FROM usuario;

 SELECT * FROM pergunta;

 SELECT * FROM tentativas_quiz;

 SELECT * FROM resposta_quiz;

 -- SELECTS COM JOIN
 SELECT u.idUsuario, u.nome, u.email, tq.idTentativa, tq.acertos, tq.erros, tq.dtTentativa
FROM usuario u
INNER JOIN tentativas_quiz tq
    ON u.idUsuario = tq.fkUsuario;

SELECT u.nome, tq.idTentativa, p.enunciado, rq.alternativaEscolhida, rq.correta
FROM usuario u
INNER JOIN tentativas_quiz tq
    ON u.idUsuario = tq.fkUsuario
INNER JOIN resposta_quiz rq
    ON tq.idTentativa = rq.fkTentativa
INNER JOIN pergunta p
    ON rq.fkPergunta = p.idPergunta;

SELECT u.nome,
    COUNT(tq.idTentativa) AS totalTentativas
FROM usuario u
LEFT JOIN tentativas_quiz tq
    ON u.idUsuario = tq.fkUsuario
GROUP BY u.idUsuario, u.nome;