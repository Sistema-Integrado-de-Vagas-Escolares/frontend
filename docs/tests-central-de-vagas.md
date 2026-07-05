# Testes — Central de Vagas Escolares

⏱ **Tempo estimado:** 5 minutos

![Tela inicial da Central de Vagas Escolares](https://res.cloudinary.com/hoekveld-dev/image/upload/v1783226173/sive/central-de-vagas.png)

## Acesso

Esta página é de acesso público, sem necessidade de login.

**URL:**

http://localhost:5173/central

---

## Fluxo 1 — Carregamento inicial

### Passos

1. Acesse a URL da Central de Vagas Escolares.

### Resultado esperado

* Cabeçalho exibido com o brasão, **"Prefeitura de Caraguatatuba"** e o título **"Central de Vagas Escolares"**.
* Subtítulo com o período letivo exibido (ex.: **"Creches e Ensino Fundamental · 2026"**).
* Indicadores gerais carregados corretamente:

  * vagas disponíveis;
  * escolas municipais;
  * alunos em lista de espera.
* Rodapé exibindo a identificação do sistema (**"Sistema Integrado de Vagas Escolares (SIVE)"**).

---

## Fluxo 2 — Card "Acompanhar lista de espera"

### Passos

1. Localize o card **"Acompanhar lista de espera"**.
2. Clique em **"Acessar portal"**.

### Resultado esperado

* O card exibe corretamente a descrição sobre o acesso utilizando CPF e senha.
* Redirecionamento para o **Portal dos Responsáveis** (tela de login).

---

## Fluxo 3 — Card "Mapa inteligente de vagas"

### Passos

1. Localize o card **"Mapa inteligente de vagas"**.
2. Clique em **"Ver mapa completo"**.

### Resultado esperado

* O card exibe corretamente a descrição sobre a exploração do mapa e seus filtros.
* Redirecionamento para a página do **Mapa de Vagas Escolares**.

---

## Fluxo 4 — Visão geral das vagas (mapa resumido)

### Passos

1. Localize a seção **"Visão geral das vagas — Caraguatatuba"**.

Verifique:

* mapa reduzido com os marcadores das escolas;
* legenda (**Com vagas**, **Poucas vagas** e **Sem vagas**);
* botão flutuante **"Ver mapa completo"** sobre o mapa;
* link **"Abrir mapa completo"** no cabeçalho da seção.

### Passos — Navegação

2. Clique no botão **"Ver mapa completo"** (sobre o mapa).
3. Retorne à página e clique no link **"Abrir mapa completo"** (no cabeçalho da seção).

### Resultado esperado

* Ambos os pontos de entrada redirecionam corretamente para a página do **Mapa de Vagas Escolares**.
* Os marcadores do mapa resumido são consistentes com os dados exibidos na lista de escolas.

---

## Fluxo 5 — Escolas com vagas disponíveis

### Passos

1. Localize a seção **"Escolas com vagas disponíveis"**.

Verifique:

* listagem das escolas com ícone da modalidade (Creche ou Ensino Fundamental), nome, bairro, modalidade e quantidade de vagas;
* link **"Ver todas as X escolas com vagas no mapa"**.

### Passos — Navegação

2. Clique em uma escola da lista.
3. Clique em **"Ver todas as X escolas com vagas no mapa"**.

### Resultado esperado

* Ao clicar em uma escola, o usuário é direcionado para o mapa com a escola correspondente já selecionada ou destacada.
* Ao clicar em **"Ver todas as X escolas com vagas no mapa"**, o usuário é direcionado para o **Mapa de Vagas Escolares**.
* A quantidade de escolas exibida no link corresponde ao total real de escolas com vagas disponíveis.

---

## Fluxo 6 — Seção "Como funciona a lista de espera?"

### Passos

1. Localize a seção **"Como funciona a lista de espera?"**.
2. Leia o texto explicativo.
3. Clique no botão **"Consultar minha posição na fila"**.

### Resultado esperado

* O texto explicativo sobre o funcionamento da lista de espera é exibido corretamente.
* O botão **"Consultar minha posição na fila"** redireciona para o **Portal dos Responsáveis** (tela de login).

---

## Fluxo 7 — Navegação geral

### Verificações

Confirme que a Central de Vagas conecta corretamente aos seguintes destinos:

* **Portal dos Responsáveis** (por meio dos botões **"Acessar portal"** e **"Consultar minha posição na fila"**);
* **Mapa de Vagas Escolares** (por meio de **"Ver mapa completo"**, **"Abrir mapa completo"** e **"Ver todas as X escolas com vagas no mapa"**);
* **Painel da Escola** e **Painel da Prefeitura**, caso existam links de acesso administrativo na página.

### Resultado esperado

* Todos os links e botões de navegação funcionam corretamente.
* Não há links quebrados nem redirecionamentos incorretos.
