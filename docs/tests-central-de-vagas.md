# Testes — Central de Vagas Escolares

⏱ Tempo estimado: 5 minutos

![Tela inicial da Central de Vagas Escolares](https://res.cloudinary.com/hoekveld-dev/image/upload/v1783226173/sive/central-de-vagas.png)

## Acesso

Esta página é de acesso público, sem necessidade de login.

**URL:**
[http://localhost:5173/central](http://localhost:5173/central)

---

## Fluxo 1 — Carregamento inicial

### Passos

1. Acessar a URL da Central de Vagas Escolares

### Resultado esperado

- Cabeçalho exibido com brasão, **"Prefeitura de Caraguatatuba"** e título **"Central de Vagas Escolares"**
- Subtítulo com o período letivo exibido (ex: "Creches e Ensino Fundamental · 2026")
- Indicadores gerais carregados corretamente:
  - vagas disponíveis
  - escolas municipais
  - em lista de espera
- Rodapé com identificação do sistema (**"Sistema Integrado de Vagas Escolares (SIVE)"**)

---

## Fluxo 2 — Card "Acompanhar lista de espera"

### Passos

1. Localizar o card **"Acompanhar lista de espera"**
2. Clicar em **"Acessar portal"**

### Resultado esperado

- Card exibe a descrição correta sobre acesso com CPF e senha
- Redirecionamento para o **Portal dos Responsáveis** (tela de login)

---

## Fluxo 3 — Card "Mapa inteligente de vagas"

### Passos

1. Localizar o card **"Mapa inteligente de vagas"**
2. Clicar em **"Ver mapa completo"**

### Resultado esperado

- Card exibe a descrição correta sobre exploração e filtros do mapa
- Redirecionamento para a página do **Mapa de Vagas Escolares**

---

## Fluxo 4 — Visão geral das vagas (mapa resumido)

### Passos

1. Localizar a seção **"Visão geral das vagas — Caraguatatuba"**

Verificar:

- mapa reduzido com os marcadores das escolas
- legenda (Com vagas / Poucas vagas / Sem vagas)
- botão flutuante **"Ver mapa completo"** sobre o mapa
- link **"Abrir mapa completo"** no cabeçalho da seção

### Passos — Navegação

2. Clicar no botão **"Ver mapa completo"** (sobre o mapa)
3. Voltar e clicar no link **"Abrir mapa completo"** (cabeçalho da seção)

### Resultado esperado

- Ambos os pontos de entrada redirecionam corretamente para a página do **Mapa de Vagas Escolares**
- Marcadores no mapa resumido consistentes com os dados exibidos na lista abaixo

---

## Fluxo 5 — Escolas com vagas disponíveis

### Passos

1. Localizar a seção **"Escolas com vagas disponíveis"**

Verificar:

- listagem das escolas com ícone de modalidade (creche/fundamental), nome, bairro, modalidade e quantidade de vagas
- link **"Ver todas as X escolas com vagas no mapa"**

### Passos — Navegação

2. Clicar em uma escola da lista
3. Clicar em **"Ver todas as X escolas com vagas no mapa"**

### Resultado esperado

- Ao clicar em uma escola, o usuário é direcionado para o mapa com a escola correspondente já selecionada/destacada
- Ao clicar em **"Ver todas as X escolas com vagas no mapa"**, o usuário é direcionado para o **Mapa de Vagas Escolares**
- Quantidade de escolas exibida no link corresponde ao total real de escolas com vagas

---

## Fluxo 6 — Seção "Como funciona a lista de espera?"

### Passos

1. Localizar a seção **"Como funciona a lista de espera?"**
2. Ler o texto explicativo
3. Clicar no botão **"Consultar minha posição na fila"**

### Resultado esperado

- Texto explicativo sobre o funcionamento da lista de espera exibido corretamente
- Botão **"Consultar minha posição na fila"** redireciona para o **Portal dos Responsáveis** (tela de login)

---

## Fluxo 7 — Navegação geral

Verificar que a Central de Vagas conecta corretamente aos três destinos principais:

- **Portal dos Responsáveis** (via "Acessar portal" e "Consultar minha posição na fila")
- **Mapa de Vagas Escolares** (via "Ver mapa completo", "Abrir mapa completo" e "Ver todas as X escolas no mapa")
- **Painel da Escola / Painel da Prefeitura** (caso existam links de acesso administrativo na página, verificar redirecionamento correto)

### Resultado esperado

- Todos os links e botões de navegação funcionam corretamente
- Nenhum link quebrado ou redirecionamento incorreto