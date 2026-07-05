# Testes — Painel Administrativo da Prefeitura

⏱ **Tempo estimado:** 5 minutos

![Tela inicial do Painel Administrativo](https://res.cloudinary.com/hoekveld-dev/image/upload/v1783223378/sive/prefeitura.png)

## Credenciais

**E-mail:**

[admin@caraguatatuba.sp.gov.br](mailto:admin@caraguatatuba.sp.gov.br)

**Senha:**

Admin@2026

---

## Fluxo 1 — Login

### Passos

1. Abra o endereço em uma nova aba do navegador: http://localhost:5173/prefeitura.
2. Informe o e-mail.
3. Informe a senha.
4. Clique em **"Acessar Painel"**.

### Resultado esperado

* Login realizado com sucesso.
* Dashboard carregado.
* Menu lateral exibido.
* Indicadores carregados corretamente.

---

## Fluxo 2 — Dashboard (Visão Geral)

### Verificações

Verifique:

* quantidade de escolas cadastradas;
* quantidade de vagas disponíveis;
* quantidade de alunos na lista de espera;
* tempo médio de espera;
* gráfico de distribuição por modalidade;
* gráfico de distribuição por período;
* ranking das escolas com maior demanda.

### Resultado esperado

* Todos os indicadores são carregados corretamente.
* Os gráficos são exibidos corretamente.
* O ranking das escolas é ordenado por demanda.

---

## Fluxo 3 — Métricas das Escolas

### Passos

1. Acesse **Métricas das Escolas**.

### Verificações

Para cada escola, verifique:

* nome;
* bairro;
* modalidade;
* endereço;
* quantidade de vagas;
* quantidade de alunos em lista de espera;
* capacidade;
* quantidade de salas;
* períodos de funcionamento.

### Resultado esperado

* Todas as escolas são carregadas corretamente.
* As informações exibidas são consistentes.
* A quantidade de vagas é exibida corretamente.

---

## Fluxo 4 — Gerenciar Escolas

### Passos

1. Acesse **Gerenciar Escolas**.

### Verificações

Verifique:

* listagem das escolas;
* botão **Editar dados**;
* botão **Excluir**;
* botão **Nova Escola**;
* botão **Importar CSV**.

### Resultado esperado

* Todas as escolas são listadas corretamente.
* As ações estão disponíveis para cada escola.
* Todos os botões funcionam corretamente.

---

## Fluxo 5 — Navegação

### Verificações

Verifique o acesso às seguintes páginas:

* Visão Geral;
* Métricas das Escolas;
* Gerenciar Escolas;
* Lista de Espera;
* Por Bairro;
* Histórico;
* Critérios de Fila;
* Configurações;
* Configurar Domínio.

### Resultado esperado

* Todas as páginas estão acessíveis.
* O menu lateral funciona corretamente.
* O item correspondente à página atual permanece destacado.

---

## Fluxo 6 — Logout

### Passos

1. Clique em **Sair**.

### Resultado esperado

* Sessão encerrada.
* Redirecionamento para a tela de login.
