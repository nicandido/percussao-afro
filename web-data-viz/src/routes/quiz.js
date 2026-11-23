var express = require("express");
var router = express.Router();

var quizController = require("../controllers/quizController");
var { exigirLogin } = require("../autenticacao/autenticacao");

// Salva as respostas da tentativa do usuário logado
router.post("/responder", exigirLogin, function (req, res) {
    quizController.responder(req, res);
});

// Resumo da última tentativa do usuário logado (dados da dashboard)
router.get("/resumo", exigirLogin, function (req, res) {
    quizController.resumo(req, res);
});

module.exports = router;
