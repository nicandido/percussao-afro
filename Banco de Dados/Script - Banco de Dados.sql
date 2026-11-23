CREATE DATABASE percussao_afro;

USE percussao_afro;

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
    CONSTRAINT fk_tentativa_usuario FOREIGN KEY (fkUsuario) REFERENCES usuario(idUsuario)
);
    
CREATE TABLE resposta_quiz(
    idResposta INT PRIMARY KEY AUTO_INCREMENT,
    fkTentativa INT NOT NULL,
    fkPergunta INT NOT NULL,
    alternativaEscolhida CHAR(1) NOT NULL,
    correta TINYINT(1) NOT NULL,
    CONSTRAINT fk_resposta_tentativa FOREIGN KEY (fkTentativa) REFERENCES tentativas_quiz(idTentativa),
    CONSTRAINT fk_resposta_pergunta FOREIGN KEY (fkPergunta) REFERENCES pergunta(idPergunta),
    CONSTRAINT uq_tentativa_pergunta UNIQUE (fkTentativa, fkPergunta)
);