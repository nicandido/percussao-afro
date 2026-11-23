var { validarToken } = require("../seguranca/token");

function exigirLogin(req, res, next) {
    var cabecalho = req.headers.authorization || "";
    var token = cabecalho.startsWith("Bearer ") ? cabecalho.slice(7) : null;
    var idUsuario = validarToken(token);

    if (idUsuario == null) {
        return res.status(401).send("Sessão inválida ou expirada. Faça login novamente.");
    }

    req.idUsuario = idUsuario;
    next();
}

module.exports = {
    exigirLogin
};
