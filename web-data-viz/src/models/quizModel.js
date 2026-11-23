var database = require("../database/config");

// Gabarito de todas as perguntas cadastradas
function buscarGabarito() {
    var instrucaoSql = `SELECT idPergunta, respostaCorreta FROM pergunta;`;
    return database.executar(instrucaoSql);
}

function registrarTentativa(idUsuario, acertos, erros) {
    var instrucaoSql = `
        INSERT INTO tentativas_quiz (fkUsuario, acertos, erros) VALUES (?, ?, ?);
    `;
    return database.executar(instrucaoSql, [idUsuario, acertos, erros]);
}

// linhas = [[idTentativa, idPergunta, alternativaEscolhida, correta], ...]
function registrarRespostas(linhas) {
    var instrucaoSql = `
        INSERT INTO resposta_quiz (fkTentativa, fkPergunta, alternativaEscolhida, correta) VALUES ?;
    `;
    return database.executar(instrucaoSql, [linhas]);
}

function removerTentativa(idTentativa) {
    var instrucaoSql = `DELETE FROM tentativas_quiz WHERE idTentativa = ?;`;
    return database.executar(instrucaoSql, [idTentativa]);
}

// Última tentativa do usuário (a de maior id é sempre a mais recente)
function buscarUltimaTentativa(idUsuario) {
    var instrucaoSql = `
        SELECT idTentativa, acertos, erros, dtTentativa
        FROM tentativas_quiz
        WHERE fkUsuario = ?
        ORDER BY idTentativa DESC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql, [idUsuario]);
}

// Acertos e total de perguntas de cada tema dentro de uma tentativa
function buscarDesempenhoPorTema(idTentativa) {
    var instrucaoSql = `
        SELECT p.tema, SUM(r.correta) AS acertos, COUNT(*) AS total
        FROM resposta_quiz r
            INNER JOIN pergunta p ON p.idPergunta = r.fkPergunta
        WHERE r.fkTentativa = ?
        GROUP BY p.tema;
    `;
    return database.executar(instrucaoSql, [idTentativa]);
}

module.exports = {
    buscarGabarito,
    registrarTentativa,
    registrarRespostas,
    removerTentativa,
    buscarUltimaTentativa,
    buscarDesempenhoPorTema
};
