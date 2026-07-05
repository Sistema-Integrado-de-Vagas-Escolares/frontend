# Testes — Mapa de Vagas Escolares

⏱ Tempo estimado: 5 minutos

![Tela inicial do Mapa de Vagas Escolares](https://res.cloudinary.com/hoekveld-dev/image/upload/v1783225964/sive/mapa.png)

## Acesso

Este mapa é de acesso público, sem necessidade de login.

**URL:**
[http://localhost:5173/mapa](http://localhost:5173/mapa)

---

## Fluxo 1 — Carregamento inicial

### Passos

1. Acessar a URL do Mapa de Vagas Escolares

### Resultado esperado

- Mapa carregado com os marcadores de todas as escolas
- Data de atualização da disponibilidade exibida (ex: "Disponibilidade em tempo real · 05/07/2026")
- Indicadores gerais carregados: total de **vagas disponíveis** e total **em lista de espera**
- Aba **Lista de Escolas** selecionada por padrão, listando todas as escolas
- Legenda do mapa exibida (Com vagas / Poucas vagas / Sem vagas)
- Link **"← Central de Vagas"** disponível no topo

---

## Fluxo 2 — Filtro por Modalidade

### Passos

1. Clicar no filtro **Creche**
2. Verificar o mapa e a lista de escolas
3. Clicar no filtro **Fundamental**
4. Verificar o mapa e a lista de escolas
5. Clicar em **Todas** para limpar o filtro

### Resultado esperado

- Ao selecionar **Creche**, somente escolas de modalidade creche são exibidas no mapa e na lista
- Ao selecionar **Fundamental**, somente escolas de modalidade fundamental são exibidas
- Indicadores de **vagas disponíveis** e **em lista de espera** recalculados conforme o filtro
- Botão do filtro ativo destacado visualmente
- Ao voltar para **Todas**, todas as escolas retornam a ser exibidas

---

## Fluxo 3 — Filtro por Período

### Passos

1. Clicar em **Integral**
2. Verificar o mapa e a lista de escolas
3. Repetir para **Manhã** e **Tarde**
4. Clicar em **Todos** para limpar o filtro

### Resultado esperado

- Somente escolas que oferecem o período selecionado são exibidas
- Indicadores recalculados conforme o filtro aplicado
- Filtros de modalidade e período podem ser combinados (ex: Creche + Integral)

---

## Fluxo 4 — Filtro por Bairro

### Passos

1. Clicar no seletor **"Todos os bairros"**
2. Selecionar um bairro específico (ex: Centro, Martim de Sá)

### Resultado esperado

- Mapa exibe somente as escolas do bairro selecionado
- Lista de escolas atualizada de acordo com o bairro
- Indicadores recalculados conforme o filtro
- Combinação com filtros de modalidade e período funcionando corretamente

---

## Fluxo 5 — Busca por escola ou endereço

### Passos

1. Digitar o nome de uma escola (ex: "Jardim das Flores") no campo **"Buscar escola ou endereço..."**
2. Digitar um endereço (ex: "Rua das Rosas")

### Resultado esperado

- Mapa e lista filtrados para exibir apenas os resultados correspondentes à busca
- Busca funciona tanto por nome da escola quanto por endereço
- Combinação da busca com os demais filtros funcionando corretamente

---

## Fluxo 6 — Botão Localizar (geolocalização)

### Passos

1. Clicar em **Localizar** no canto superior direito do mapa
2. Permitir o acesso à localização quando solicitado pelo navegador

### Resultado esperado

- Navegador solicita permissão de geolocalização (se ainda não concedida)
- Mapa centraliza na localização atual do usuário
- Marcador da localização atual exibido no mapa
- Escolas próximas à localização atual destacadas ou priorizadas na lista

### Resultado esperado — permissão negada

- Mensagem informando que não foi possível obter a localização
- Mapa permanece na visualização padrão

---

## Fluxo 7 — Marcadores de escolas no mapa

### Passos

1. Clicar em um marcador com status **Com vagas** (verde), ex: Paulo Freire
2. Clicar em um marcador com status **Poucas vagas** (laranja), ex: EMEI Arco-Íris
3. Clicar em um marcador com status **Sem vagas** (vermelho), ex: Sol Nascente

### Resultado esperado

- Ao clicar no marcador, um card de detalhes é exibido diretamente no mapa com:
  - modalidade (Creche/Fundamental)
  - nome da escola
  - endereço e bairro
  - quantidade de vagas disponíveis
  - quantidade de alunos na espera
  - capacidade total
  - quantidade de salas
  - período(s) oferecido(s) (Manhã/Tarde)
  - botão **Consultar lista de espera**
- Card correspondente também é destacado/aberto na lista de escolas à esquerda
- Botão **"X"** no card fecha os detalhes
- Cores dos marcadores correspondem corretamente à legenda (verde/laranja/vermelho)

---

## Fluxo 8 — Lista de Escolas

### Passos

1. Acessar a aba **Lista de Escolas**
2. Clicar em uma escola da lista

### Resultado esperado

- Escolas listadas com modalidade, bairro, nome, endereço e quantidade de vagas
- Card expandido exibe: alunos na espera, capacidade, quantidade de salas e períodos oferecidos
- Botão **Consultar lista de espera** disponível em cada escola
- Ao clicar em uma escola da lista, o mapa centraliza no marcador correspondente

---

## Fluxo 9 — Aba "Sobre o sistema"

### Passos

1. Clicar na aba **Sobre o sistema**

### Resultado esperado

- Conteúdo informativo sobre o funcionamento do mapa e da lista de espera exibido corretamente

---

## Fluxo 10 — Consultar lista de espera

### Passos

1. Em qualquer escola (card do mapa ou da lista), clicar em **Consultar lista de espera**

### Resultado esperado

- Redirecionamento (ou abertura) para a página/portal correspondente de consulta da lista de espera daquela escola

---

## Fluxo 11 — Navegação

### Passos

1. Clicar em **"← Central de Vagas"**

### Resultado esperado

- Redirecionamento para a página pública da Central de Vagas