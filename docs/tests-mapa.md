# Testes — Mapa de Vagas Escolares

⏱ **Tempo estimado:** 5 minutos

![Tela inicial do Mapa de Vagas Escolares](https://res.cloudinary.com/hoekveld-dev/image/upload/v1783225964/sive/mapa.png)

## Acesso

Este mapa é de acesso público, sem necessidade de login.

**URL:**

Abra o endereço em uma nova aba do navegador: http://localhost:5173/mapa

---

## Fluxo 1 — Carregamento inicial

### Passos

1. Acesse a URL do Mapa de Vagas Escolares.

### Resultado esperado

* Mapa carregado com os marcadores de todas as escolas.
* Data de atualização da disponibilidade exibida (ex.: **"Disponibilidade em tempo real · 05/07/2026"**).
* Indicadores gerais carregados corretamente: total de **vagas disponíveis** e total de alunos **em lista de espera**.
* Aba **Lista de Escolas** selecionada por padrão, exibindo todas as escolas.
* Legenda do mapa exibida (**Com vagas**, **Poucas vagas** e **Sem vagas**).
* Link **"← Central de Vagas"** disponível no topo da página.

---

## Fluxo 2 — Filtro por modalidade

### Passos

1. Clique no filtro **Creche**.
2. Verifique o mapa e a lista de escolas.
3. Clique no filtro **Ensino Fundamental**.
4. Verifique o mapa e a lista de escolas.
5. Clique em **Todas** para limpar o filtro.

### Resultado esperado

* Ao selecionar **Creche**, somente escolas dessa modalidade são exibidas no mapa e na lista.
* Ao selecionar **Ensino Fundamental**, somente escolas dessa modalidade são exibidas.
* Os indicadores de **vagas disponíveis** e **em lista de espera** são recalculados conforme o filtro aplicado.
* O filtro ativo permanece destacado visualmente.
* Ao selecionar **Todas**, todas as escolas voltam a ser exibidas.

---

## Fluxo 3 — Filtro por período

### Passos

1. Clique em **Integral**.
2. Verifique o mapa e a lista de escolas.
3. Repita o procedimento para **Manhã** e **Tarde**.
4. Clique em **Todos** para limpar o filtro.

### Resultado esperado

* Somente as escolas que oferecem o período selecionado são exibidas.
* Os indicadores são recalculados conforme o filtro aplicado.
* Os filtros de modalidade e período podem ser combinados (ex.: **Creche + Integral**).

---

## Fluxo 4 — Filtro por bairro

### Passos

1. Clique no seletor **"Todos os bairros"**.
2. Selecione um bairro específico (ex.: **Centro** ou **Martim de Sá**).

### Resultado esperado

* O mapa exibe somente as escolas do bairro selecionado.
* A lista de escolas é atualizada conforme o bairro selecionado.
* Os indicadores são recalculados conforme o filtro aplicado.
* A combinação com os filtros de modalidade e período funciona corretamente.

---

## Fluxo 5 — Busca por escola ou endereço

### Passos

1. Digite o nome de uma escola (ex.: **"Jardim das Flores"**) no campo **"Buscar escola ou endereço..."**.
2. Digite um endereço (ex.: **"Rua das Rosas"**).

### Resultado esperado

* O mapa e a lista exibem apenas os resultados correspondentes à busca.
* A busca funciona tanto pelo nome da escola quanto pelo endereço.
* A busca pode ser combinada com os demais filtros.

---

## Fluxo 6 — Botão Localizar (geolocalização)

### Passos

1. Clique em **Localizar**, no canto superior direito do mapa.
2. Permita o acesso à localização quando solicitado pelo navegador.

### Resultado esperado

* O navegador solicita permissão para acessar a localização (caso ainda não tenha sido concedida).
* O mapa é centralizado na localização atual do usuário.
* Um marcador indicando a localização atual é exibido no mapa.
* As escolas mais próximas da localização do usuário são destacadas ou priorizadas na lista.

### Resultado esperado — Permissão negada

* É exibida uma mensagem informando que não foi possível obter a localização.
* O mapa permanece na visualização padrão.

---

## Fluxo 7 — Marcadores de escolas no mapa

### Passos

1. Clique em um marcador com o status **Com vagas** (verde), como **Paulo Freire**.
2. Clique em um marcador com o status **Poucas vagas** (laranja), como **EMEI Arco-Íris**.
3. Clique em um marcador com o status **Sem vagas** (vermelho), como **Sol Nascente**.

### Resultado esperado

* Ao clicar em um marcador, um card de detalhes é exibido diretamente no mapa contendo:

  * modalidade (Creche ou Ensino Fundamental);
  * nome da escola;
  * endereço e bairro;
  * quantidade de vagas disponíveis;
  * quantidade de alunos em lista de espera;
  * capacidade total;
  * quantidade de salas;
  * período(s) oferecido(s) (**Manhã** e/ou **Tarde**);
  * botão **Consultar lista de espera**.
* O card correspondente também é destacado ou expandido na lista de escolas à esquerda.
* O botão **"X"** fecha o card de detalhes.
* As cores dos marcadores correspondem corretamente à legenda (verde, laranja e vermelho).

---

## Fluxo 8 — Lista de Escolas

### Passos

1. Acesse a aba **Lista de Escolas**.
2. Clique em uma escola da lista.

### Resultado esperado

* As escolas são listadas com modalidade, bairro, nome, endereço e quantidade de vagas.
* O card expandido exibe a quantidade de alunos em lista de espera, capacidade, quantidade de salas e períodos oferecidos.
* O botão **Consultar lista de espera** está disponível em cada escola.
* Ao clicar em uma escola da lista, o mapa é centralizado no marcador correspondente.

---

## Fluxo 9 — Aba "Sobre o sistema"

### Passos

1. Clique na aba **Sobre o sistema**.

### Resultado esperado

* O conteúdo informativo sobre o funcionamento do mapa e da lista de espera é exibido corretamente.

---

## Fluxo 10 — Consultar lista de espera

### Passos

1. Em qualquer escola (pelo card do mapa ou da lista), clique em **Consultar lista de espera**.

### Resultado esperado

* O usuário é redirecionado para a página ou portal correspondente para consultar a lista de espera da escola selecionada.

---

## Fluxo 11 — Navegação

### Passos

1. Clique em **"← Central de Vagas"**.

### Resultado esperado

* Redirecionamento para a página pública da **Central de Vagas**.
