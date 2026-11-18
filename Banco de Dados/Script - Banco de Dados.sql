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
    CONSTRAINT fk_tentativa_usuario FOREIGN KEY (fkUsuario) REFERENCES usuario(idUsuario));