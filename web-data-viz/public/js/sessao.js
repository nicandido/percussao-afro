var PAGINA_LOGIN = "/paginas/login.html";

function estaLogado() {
    return !!(sessionStorage.TOKEN_USUARIO && sessionStorage.ID_USUARIO && sessionStorage.NOME_USUARIO);
}

function irParaLogin() {
    // guarda a página atual para voltar a ela depois do login
    window.location.replace(PAGINA_LOGIN + "?destino=" + encodeURIComponent(window.location.pathname));
}

// Chame no <head> das páginas que só podem ser vistas por quem fez login
function exigirLogin() {
    if (!estaLogado()) {
        irParaLogin();
    }
}

function limparSessao() {
    sessionStorage.clear();
    window.location.href = "/index.html";
}

// fetch que já envia o token. Se a API disser que a sessão expirou (401), volta para o login.
function apiAutenticada(url, opcoes) {
    opcoes = opcoes || {};
    opcoes.headers = Object.assign({}, opcoes.headers, {
        Authorization: "Bearer " + sessionStorage.TOKEN_USUARIO
    });

    return fetch(url, opcoes).then(function (resposta) {
        if (resposta.status === 401) {
            sessionStorage.clear();
            irParaLogin();
            throw new Error("Sessão expirada");
        }
        return resposta;
    });
}

// Ajusta o menu: logado mostra Dashboard e Sair; deslogado mostra Login e Cadastrar.
// Funciona nos <li> que tiverem estes ids (se a página não tiver, nada acontece).
function atualizarMenu() {
    var logado = estaLogado();
    var mostrar = { "nav-dashboard": logado, "nav-sair": logado, "nav-quiz": logado, "nav-login": !logado, "nav-cadastro": !logado };

    Object.keys(mostrar).forEach(function (id) {
        var item = document.getElementById(id);
        if (item) {
            item.hidden = !mostrar[id];
        }
    });
}

document.addEventListener("DOMContentLoaded", atualizarMenu);
