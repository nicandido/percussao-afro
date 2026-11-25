# Percussão Afro

Site educativo sobre a cultura afro-brasileira, com foco em ritmos e manifestações como **samba**, **maracatu**, **capoeira** e **umbanda**. O projeto reúne conteúdo sobre cada tema, um **quiz** para testar o conhecimento e uma **dashboard** que mostra o desempenho de cada usuário.

Projeto individual desenvolvido no curso de Análise e Desenvolvimento de Sistemas da **SPTech School**.

\---

## Sumário

* [Sobre o projeto](#sobre-o-projeto)
* [Funcionalidades](#funcionalidades)
* [Alinhamento com os ODS](#alinhamento-com-os-ods)
* [Tecnologias](#tecnologias)
* [Arquitetura](#arquitetura)
* [Modelagem do banco de dados](#modelagem-do-banco-de-dados)
* [Como executar](#como-executar)
* [API](#api)
* [Segurança](#segurança)
* [Melhorias futuras](#melhorias-futuras)
* [Autor](#autor)

\---

## Sobre o projeto

O **Percussão Afro** nasceu para valorizar e divulgar a cultura de matriz africana no Brasil de forma acessível. O visitante conhece cada manifestação cultural, cria uma conta, responde ao quiz e acompanha na dashboard como foi o seu desempenho, inclusive por tema.

## Funcionalidades

* **Páginas de conteúdo:** index, Sobre o Projeto, Sobre Mim, Acervo, Samba, Maracatu, Capoeira e Umbanda.
* **Cadastro e login:** com nome, e-mail e senha. O menu muda conforme o estado do usuário: visitante vê *Login* e *Cadastrar*; usuário logado vê *Quiz*, *Dashboard* e *Sair*.
* **Acesso protegido:** o quiz e a dashboard só abrem para usuários logados. Quem tenta entrar sem login é redirecionado e volta à página pedida depois de entrar.
* **Quiz com 10 perguntas:** a correção é feita no servidor. Cada tentativa é salva com data e hora, junto com cada resposta dada.
* **Dashboard** com os dados da **última tentativa** do usuário:

  * perguntas acertadas;
  * tema com mais acertos;
  * aproveitamento nesse tema;
  * aproveitamento geral, somando todas as tentativas;
  * gráfico de barras com o aproveitamento por tema (Chart.js), com opção de ver os números em tabela.
* **Layout responsivo**, com a dashboard compactada para mostrar o gráfico sem precisar rolar a tela em notebooks.

## Alinhamento com os ODS

|ODS|Meta|Como o projeto contribui|
|-|-|-|
|**4 – Educação de Qualidade**|4.7|Ensina sobre a diversidade cultural afro-brasileira e acompanha o aprendizado com quiz e dashboard|
|**11 – Cidades e Comunidades Sustentáveis**|11.4|Divulga e registra o patrimônio cultural imaterial por meio do acervo|

## Tecnologias

**Front-end**

* HTML5, CSS3 e JavaScript (sem frameworks)
* [Chart.js](https://www.chartjs.org/) v4 para o gráfico da dashboard
* `sessionStorage` para guardar a sessão no navegador

**Back-end**

* [Node.js](https://nodejs.org/) e [Express](https://expressjs.com/)
* [mysql2](https://github.com/sidorares/node-mysql2) para acesso ao banco, com consultas parametrizadas
* [dotenv](https://github.com/motdotla/dotenv) para variáveis de ambiente
* [cors](https://github.com/expressjs/cors)
* Módulo `crypto` do Node.js para assinar o token de sessão

**Banco de dados**

* MySQL (modelagem feita no MySQL Workbench)

## Arquitetura

O servidor Express serve os arquivos estáticos da pasta `public/` e expõe a API em rotas separadas, seguindo a divisão em camadas do modelo da SPTech (`web-data-viz`):

```
rota  →  controller  →  model  →  banco de dados
```

```
.
├── app.js                      # servidor Express (rotas e arquivos estáticos)
├── .env                        # variáveis de ambiente (não versionar)
├── sql/                        # scripts do banco
├── src/
│   ├── database/config.js      # conexão com o MySQL
│   ├── routes/                 # usuarios.js, quiz.js
│   ├── controllers/            # regras e validações
│   ├── models/                 # consultas SQL
│   ├── middlewares/            # verificação do login
│   └── utils/                  # geração e validação do token
└── public/
    ├── index.html
    ├── css/                    # style.css, index.css, autenticacao.css, quiz.css, dashboard.css
    ├── js/sessao.js            # sessão, menu dinâmico e proteção de páginas
    └── paginas/                # login, cadastro, quiz, dashboard e páginas de conteúdo
```

> Os nomes das pastas internas (como `utils` e `middlewares`) podem variar no seu repositório.

## Modelagem do banco de dados

Banco: `percussao\_afro`, com 4 tabelas.

```
usuario ──1:N──▶ tentativas\_quiz ──1:N──▶ resposta\_quiz ◀──N:1── pergunta
```

|Tabela|Descrição|Chaves|
|-|-|-|
|`usuario`|Contas cadastradas (nome, e-mail, senha, data de cadastro)|PK `idUsuario`|
|`pergunta`|Perguntas do quiz, alternativas A–D, resposta correta e tema|PK `idPergunta`|
|`tentativas\_quiz`|Cada vez que o usuário envia o quiz (acertos, erros, data/hora)|PK `idTentativa`, FK `fkUsuario`|
|`resposta\_quiz`|Cada resposta dada em uma tentativa|PK composta `(idResposta, fkTentativa)`, FK `fkPergunta`|

**Relacionamentos**

* `usuario → tentativas\_quiz`: 1:N
* `tentativas\_quiz → resposta\_quiz`: 1:N
* `pergunta → resposta\_quiz`: 1:N



## Como executar

**Pré-requisitos:** Node.js 18+ e MySQL 8.

1. **Clone o repositório**

```bash
   git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   cd SEU-REPOSITORIO
   ```

2. **Crie o banco de dados**
Execute no MySQL, nesta ordem: o script de criação do banco (`percussao\_afro`) e o das perguntas do quiz (`sql/02\_seed\_perguntas.sql`). Rode o script das perguntas apenas se a tabela `pergunta` estiver vazia.
3. **Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz:

```env
   AMBIENTE\_PROCESSO=producao
   APP\_HOST=localhost
   APP\_PORT=3333
   DB\_HOST=localhost
   DB\_DATABASE=percussao\_afro
   DB\_USER=seu\_usuario
   DB\_PASSWORD=sua\_senha
   DB\_PORT=3306
   TOKEN\_SECRET=uma\_frase\_longa\_e\_aleatoria
   ```

> Com `AMBIENTE\_PROCESSO=producao` a aplicação lê o `.env`; com `desenvolvimento`, lê o `.env.dev`.

4. **Instale as dependências e inicie**

```bash
   npm install
   npm start
   ```

5. **Acesse** `http://localhost:3333` (ou a porta definida em `APP\_PORT`).

## API

|Método|Rota|Acesso|Descrição|
|-|-|-|-|
|`POST`|`/usuarios/cadastrar`|público|Cria uma conta (nome, e-mail, senha)|
|`POST`|`/usuarios/autenticar`|público|Faz login e devolve os dados do usuário e o token|
|`POST`|`/quiz/responder`|logado|Corrige o quiz no servidor e salva a tentativa e as respostas|
|`GET`|`/quiz/resumo`|logado|Devolve os dados da dashboard (última tentativa, temas e aproveitamento geral)|

As rotas protegidas exigem o cabeçalho `Authorization: Bearer <token>`.

## Segurança

* **Token de sessão** assinado com HMAC-SHA256 (módulo `crypto`), com validade de 12 horas, enviado no cabeçalho `Authorization`.
* **Consultas parametrizadas** em todo o acesso ao banco, contra SQL injection, e validação dos tipos recebidos.
* **Correção do quiz no servidor:** o navegador envia só as alternativas escolhidas; o gabarito não é exposto.
* **Redirecionamento seguro** após o login, restrito a páginas internas do site.
* A senha não é devolvida ao navegador depois do login.

## Melhorias futuras

* **Criptografar as senhas** com hash (bcrypt ou scrypt). Hoje elas são armazenadas em texto simples, como no modelo base da SPTech, e isso é a melhoria mais importante.
* Histórico com a evolução de todas as tentativas na dashboard.
* Ranking e conquistas por tema.
* Mais perguntas, níveis de dificuldade e novos temas.
* Recuperação de senha e edição de perfil.

## Autor

**Nicollas Martins Candido** — estudante de Análise e Desenvolvimento de Sistemas na SPTech School.

* GitHub: [@](https://github.com/SEU-USUARIO)nicandido
* LinkedIn: Nicollas Martins Candido

