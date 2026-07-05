# Testes — Portal SIVE (Login e Seleção de Módulos)

⏱ **Tempo estimado:** 5 minutos

![Tela inicial do Portal SIVE](https://res.cloudinary.com/hoekveld-dev/image/upload/v1783226406/sive/portal-sive.png)

## Credenciais

**E-mail institucional:**

[admin@caraguatatuba.sp.gov.br](mailto:admin@caraguatatuba.sp.gov.br)

**Senha:**

Admin@2026

---

## Fluxo 1 — Login

### Passos

1. Acesse http://localhost:5173/portal.
2. Informe o e-mail institucional.
3. Informe a senha.
4. Clique em **"Acessar o SIVE"**.

### Resultado esperado

* Login realizado com sucesso.
* Redirecionamento para a tela **"Selecione o módulo de acesso"**.
* Nome do município e brasão exibidos corretamente no cabeçalho.

### Verificações adicionais (tela de login)

Verifique:

* logo e nome **SIVE** exibidos;
* texto institucional **"Sistema Integrado de Vagas Escolares"** e descrição da plataforma;
* lista de funcionalidades exibida:

  * Painel da Prefeitura com indicadores estratégicos para vagas;
  * Gestão da lista de espera pelas escolas;
  * Consulta da lista de espera para responsáveis;
  * Mapa público de vagas por região.
* bloco de recuperação de senha exibindo o contato **[suporte@sive.com.br](mailto:suporte@sive.com.br)**;
* aviso de segurança e conformidade com a LGPD exibido no rodapé.

---

## Fluxo 2 — Validações de login

### Passos

1. Tente acessar com um e-mail inválido ou deixe o campo em branco.
2. Tente acessar com uma senha incorreta.
3. Tente acessar com ambos os campos em branco.

### Resultado esperado

* Mensagens de erro são exibidas para cada cenário inválido.
* O login não é concluído em nenhum dos casos.
* Nenhuma informação sensível é exposta nas mensagens de erro.

---

## Fluxo 3 — Tela de Seleção de Módulos

### Passos

1. Realize o login com sucesso.

### Verificações

Verifique:

* cabeçalho com o brasão, **"Prefeitura Municipal"**, nome do município e estado;
* aviso de autenticação e proteção de dados (LGPD);
* botão **Sair** no canto superior direito;
* seção **"Selecione o módulo de acesso"** contendo os seguintes cards:

  * **Painel da Prefeitura** (tag **Gestão**);
  * **Painel da Escola** (tag **Escolas**);
  * **Portal dos Responsáveis** (tag **Público**);
  * **Mapa Inteligente de Vagas** (tag **Público**);
  * **Central de Vagas Escolares** (tag **Site Público**).

### Resultado esperado

* Todos os cards são carregados com título, tag, descrição e seta de acesso.
* As tags são exibidas corretamente conforme o tipo de módulo (**Gestão**, **Escolas**, **Público** e **Site Público**).

---

## Fluxo 4 — Navegação para cada módulo

### Passos

1. Clique no card **Painel da Prefeitura**.
2. Retorne à tela de seleção de módulos e clique no card **Painel da Escola**.
3. Retorne e clique no card **Portal dos Responsáveis**.
4. Retorne e clique no card **Mapa Inteligente de Vagas**.
5. Retorne e clique no card **Central de Vagas Escolares**.

### Resultado esperado

* Cada card redireciona corretamente para o respectivo módulo:

  * **Painel da Prefeitura** → login ou dashboard administrativo da prefeitura;
  * **Painel da Escola** → login ou dashboard da escola;
  * **Portal dos Responsáveis** → tela de login do portal (CPF e senha);
  * **Mapa Inteligente de Vagas** → mapa público de vagas;
  * **Central de Vagas Escolares** → página pública inicial.
* Não há links quebrados nem redirecionamentos incorretos.

---

## Fluxo 5 — Logout

### Passos

1. Na tela de seleção de módulos, clique em **Sair**.

### Resultado esperado

* Sessão encerrada.
* Redirecionamento para a tela de login do Portal SIVE.
