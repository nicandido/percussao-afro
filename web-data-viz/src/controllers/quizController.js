var quizModel = require("../models/quizModel");

// Recebe: { respostas: [ { idPergunta: 1, alternativa: "B" }, ... ] }
// O id do usuário vem do token (req.idUsuario), nunca do corpo da requisição.
// Quem corrige é o servidor, comparando com o gabarito do banco.
async function responder(req, res) {
    var respostas = req.body.respostas;

    if (!Array.isArray(respostas) || respostas.length == 0) {
        return res.status(400).send("As respostas do quiz estão indefinidas!");
    }

    // valida o formato de cada resposta
    var escolhidas = {}; // idPergunta -> alternativa
    for (var i = 0; i < respostas.length; i++) {
        var item = respostas[i];
        if (item == null || !Number.isInteger(item.idPergunta) || typeof item.alternativa !== "string") {
            return res.status(400).send("Formato de resposta inválido!");
        }

        var alternativa = item.alternativa.toUpperCase();
        if (!/^[A-D]$/.test(alternativa)) {
            return res.status(400).send("Alternativa inválida: " + item.alternativa);
        }
        if (escolhidas[item.idPergunta] !== undefined) {
            return res.status(400).send("Pergunta respondida mais de uma vez: " + item.idPergunta);
        }
        escolhidas[item.idPergunta] = alternativa;
    }

    var idTentativa = null;

    try {
        var gabarito = await quizModel.buscarGabarito();

        if (Object.keys(escolhidas).length != gabarito.length) {
            return res.status(400).send("Responda todas as perguntas antes de enviar!");
        }

        var acertos = 0;
        var linhas = [];
        for (var j = 0; j < gabarito.length; j++) {
            var pergunta = gabarito[j];
            var escolha = escolhidas[pergunta.idPergunta];

            if (escolha === undefined) {
                return res.status(400).send("Pergunta não respondida: " + pergunta.idPergunta);
            }

            var correta = escolha == String(pergunta.respostaCorreta).trim().toUpperCase() ? 1 : 0;
            acertos += correta;
            linhas.push([null, pergunta.idPergunta, escolha, correta]); // o 1º valor é preenchido abaixo
        }
        var erros = gabarito.length - acertos;

        var resultado = await quizModel.registrarTentativa(req.idUsuario, acertos, erros);
        idTentativa = resultado.insertId;

        linhas.forEach(function (linha) { linha[0] = idTentativa; });
        await quizModel.registrarRespostas(linhas);

        res.status(201).json({
            idTentativa: idTentativa,
            acertos: acertos,
            erros: erros,
            total: gabarito.length
        });
    } catch (erro) {
        console.log(erro);
        console.log("\nHouve um erro ao salvar o quiz! Erro: ", erro.sqlMessage);

        // se a tentativa chegou a ser criada mas as respostas não, desfaz para não sobrar tentativa vazia
        if (idTentativa != null) {
            try {
                await quizModel.removerTentativa(idTentativa);
            } catch (erroRemocao) {
                console.log(erroRemocao);
            }
        }

        res.status(500).json(erro.sqlMessage || "Erro ao salvar o quiz.");
    }
}

// Dados da dashboard: última tentativa do usuário logado
async function resumo(req, res) {
    try {
        var tentativas = await quizModel.buscarUltimaTentativa(req.idUsuario);

        if (tentativas.length == 0) {
            return res.status(200).json({ temTentativa: false });
        }

        var tentativa = tentativas[0];
        var desempenho = await quizModel.buscarDesempenhoPorTema(tentativa.idTentativa);

        var temas = desempenho.map(function (linha) {
            var acertosTema = Number(linha.acertos);
            var totalTema = Number(linha.total);
            return {
                tema: linha.tema,
                acertos: acertosTema,
                total: totalTema,
                percentual: Math.round((acertosTema / totalTema) * 100)
            };
        });

        // Tema que mais acertou = maior percentual de acertos.
        // Empate: vence quem tem mais acertos; persistindo o empate, ordem alfabética.
        temas.sort(function (a, b) {
            var taxaA = a.acertos / a.total;
            var taxaB = b.acertos / b.total;
            if (taxaB != taxaA) return taxaB - taxaA;
            if (b.acertos != a.acertos) return b.acertos - a.acertos;
            return a.tema.localeCompare(b.tema);
        });

        // quem não acertou nada não tem "tema destaque"
        var temaDestaque = temas.length > 0 && temas[0].acertos > 0 ? temas[0] : null;

        res.status(200).json({
            temTentativa: true,
            idTentativa: tentativa.idTentativa,
            data: tentativa.dtTentativa,
            acertos: tentativa.acertos,
            erros: tentativa.erros,
            total: tentativa.acertos + tentativa.erros,
            temaDestaque: temaDestaque,
            temas: temas
        });
    } catch (erro) {
        console.log(erro);
        console.log("\nHouve um erro ao buscar o resumo do quiz! Erro: ", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage || "Erro ao buscar o resumo do quiz.");
    }
}

module.exports = {
    responder,
    resumo
};
