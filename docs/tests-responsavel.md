# Testes — Portal dos Responsáveis

⏱ **Tempo estimado:** 5 minutos

![Tela inicial do Portal dos Responsáveis](https://res.cloudinary.com/hoekveld-dev/image/upload/v1783225436/sive/responsavel.png)

## Credenciais

**CPF do Responsável:**

123.456.789-00

**Senha:**

Resp@2026

---

## Fluxo 1 — Login

### Passos

1. Abra o endereço em uma nova aba do navegador: http://localhost:5173/responsavel.
2. Informe o CPF do responsável.
3. Informe a senha.
4. Clique em **"Entrar"**.

### Resultado esperado

* Login realizado com sucesso.
* Redirecionamento para a página **"Olá, [Nome do Responsável]"**.
* CPF e data da última atualização exibidos corretamente.
* Solicitações da lista de espera carregadas.

### Verificações adicionais

Verifique:

* link **"← Central de Vagas"** disponível para retornar à página pública;
* link **"Esqueceu a senha? Recuperar acesso"** disponível;
* aviso de proteção de dados (LGPD) exibido.

---

## Fluxo 2 — Página Inicial (Minhas Solicitações)

### Verificações

Verifique:

* nome e CPF do responsável logado;
* data da última atualização;
* um card para cada filho com solicitação na lista de espera, contendo:

  * nome da criança;
  * idade, modalidade (Creche ou Ensino Fundamental) e período;
  * escola solicitada;
  * status (**Em espera** ou **Chamado**);
  * posição na fila (quando em espera);
  * barra de progresso com o percentual de crianças já atendidas;
  * alerta de **vaga disponível** (quando aplicável);
* aviso sobre notificações de alteração de posição na fila;
* botão **Sair**.

### Resultado esperado

* Todos os filhos vinculados ao responsável são listados corretamente.
* O status e a posição de cada solicitação são exibidos corretamente.
* O alerta de vaga disponível é destacado quando aplicável.

---

## Fluxo 3 — Detalhes do Filho (Em espera)

### Passos

1. Clique em um filho com status **Em espera** (ex.: **Lucas Oliveira**).

### Verificações

Verifique:

* situação da solicitação, escola, modalidade e período;
* posição atual na fila e total de inscritos na lista de espera;
* barra de progresso com o percentual de crianças já atendidas;
* pontuação ponderada geral;
* seção **"Por que estou nessa posição?"**, contendo critérios, pesos e pontuações:

  * renda familiar;
  * distância da residência;
  * mãe trabalhadora;
  * irmão matriculado na escola;
* histórico de movimentações (posição atualizada, inscrição confirmada e cadastro realizado);
* posições vizinhas (à frente e atrás), com o critério de destaque de cada uma;
* lista de documentos necessários para matrícula.

### Resultado esperado

* Os dados são consistentes com os exibidos na página inicial.
* A pontuação e os pesos são exibidos corretamente.
* O histórico é apresentado em ordem cronológica decrescente.
* A navegação pelo breadcrumb **"Meus filhos / [Nome]"** funciona corretamente.

---

## Fluxo 4 — Detalhes do Filho (Chamado / Vaga disponível)

### Passos

1. Clique em um filho com status **Chamado** (ex.: **Ana Oliveira**).

### Verificações

Verifique:

* selo de situação **Chamado**;
* alerta **"Vaga disponível!"** com o prazo para confirmação;
* pontuação ponderada e detalhamento dos critérios;
* histórico de movimentações, incluindo o evento de chamada para confirmação;
* lista de documentos necessários para matrícula.

### Resultado esperado

* O alerta de vaga disponível é exibido com destaque.
* O prazo para confirmação é exibido corretamente.
* O histórico apresenta o evento mais recente no topo da lista.

---

## Fluxo 5 — Navegação

### Verificações

Verifique:

* **Voltar ao portal**, retornando da tela de detalhes do filho para a página inicial;
* breadcrumb **Meus filhos**, retornando à listagem de solicitações;
* link **Central de Vagas**, retornando à página pública a partir da tela de login.

### Resultado esperado

* Todas as rotas estão acessíveis.
* Cada link retorna corretamente para a página esperada.

---

## Fluxo 6 — Logout

### Passos

1. Clique em **Sair**.

### Resultado esperado

* Sessão encerrada.
* Redirecionamento para a tela de login do Portal dos Responsáveis.
