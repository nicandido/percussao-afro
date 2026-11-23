// Token de login assinado (HMAC), sem precisar instalar nenhuma biblioteca.
// Formato: <dados em base64>.<assinatura>
// Quem não conhece o TOKEN_SECRET não consegue criar nem alterar um token válido.
var crypto = require("crypto");

var DURACAO_MS = 12 * 60 * 60 * 1000; // o login vale por 12 horas

function segredo() {
    if (!process.env.TOKEN_SECRET) {
        throw new Error("Defina TOKEN_SECRET no arquivo .env / .env.dev (uma frase longa e aleatória).");
    }
    return process.env.TOKEN_SECRET;
}

function assinar(texto) {
    return crypto.createHmac("sha256", segredo()).update(texto).digest("base64url");
}

function gerarToken(idUsuario) {
    var dados = Buffer.from(JSON.stringify({ id: idUsuario, exp: Date.now() + DURACAO_MS })).toString("base64url");
    return dados + "." + assinar(dados);
}

// Devolve o id do usuário se o token for válido; senão devolve null
function validarToken(token) {
    if (typeof token !== "string") return null;

    var partes = token.split(".");
    if (partes.length !== 2) return null;

    var assinaturaRecebida = Buffer.from(partes[1]);
    var assinaturaEsperada = Buffer.from(assinar(partes[0]));
    if (assinaturaRecebida.length !== assinaturaEsperada.length ||
        !crypto.timingSafeEqual(assinaturaRecebida, assinaturaEsperada)) {
        return null;
    }

    try {
        var dados = JSON.parse(Buffer.from(partes[0], "base64url").toString());
        if (!dados.exp || dados.exp < Date.now()) return null;
        return dados.id;
    } catch (erro) {
        return null;
    }
}

// Falha logo ao iniciar o servidor se o TOKEN_SECRET estiver faltando
segredo();

module.exports = {
    gerarToken,
    validarToken
};
