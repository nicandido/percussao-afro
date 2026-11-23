var usuarioModel = require("../models/usuarioModel");
var { gerarToken } = require("../seguranca/token");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (typeof email !== "string" || email == "") {
        res.status(400).send("Seu email está undefined!");
    } else if (typeof senha !== "string" || senha == "") {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(function (resultado) {
                if (resultado.length == 1) {
                    var usuario = resultado[0];

                    // a senha NÃO volta para o navegador; no lugar dela vai o token de acesso
                    res.json({
                        id: usuario.idUsuario,
                        nome: usuario.nome,
                        email: usuario.email,
                        token: gerarToken(usuario.idUsuario)
                    });
                } else {
                    res.status(403).send("Email e/ou senha inválido(s)");
                }
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            });
    }
}

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (typeof nome !== "string" || nome.trim() == "") {
        res.status(400).send("Seu nome está undefined!");
    } else if (typeof email !== "string" || email.trim() == "") {
        res.status(400).send("Seu email está undefined!");
    } else if (typeof senha !== "string" || senha == "") {
        res.status(400).send("Sua senha está undefined!");
    } else if (nome.length > 100 || email.length > 100 || senha.length > 255) {
        res.status(400).send("Algum campo excede o tamanho permitido!");
    } else if (email.indexOf("@") == -1 || email.indexOf(".") == -1) {
        res.status(400).send("Email inválido!");
    } else {

        usuarioModel.cadastrar(nome.trim(), email.trim(), senha)
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao realizar o cadastro! Erro: ", erro.sqlMessage);

                if (erro.code == "ER_DUP_ENTRY") {
                    res.status(409).send("Este e-mail já está cadastrado!");
                } else {
                    res.status(500).json(erro.sqlMessage);
                }
            });
    }
}

module.exports = {
    autenticar,
    cadastrar
};
