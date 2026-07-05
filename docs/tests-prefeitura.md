# Testes — Painel Administrativo da Prefeitura

⏱ Tempo estimado: 5 minutos

![Tela inicial do Painel Administrativo](https://res.cloudinary.com/hoekveld-dev/image/upload/v1783223378/sive/prefeitura.png)

## Credenciais

**E-mail:**
admin@caraguatatuba.sp.gov.br

**Senha:**
Admin@2026

---

## Fluxo 1 — Login

### Passos

1. Acessar [http://localhost:5173/prefeitura](http://localhost:5173/prefeitura)
2. Informar o e-mail
3. Informar a senha
4. Clicar em **"Acessar Painel"**

### Resultado esperado

- Login realizado com sucesso
- Dashboard carregado
- Menu lateral exibido
- Indicadores carregados

---

## Fluxo 2 — Dashboard (Visão Geral)

Verificar:

- quantidade de escolas cadastradas
- quantidade de vagas disponíveis
- quantidade de alunos na lista de espera
- tempo médio de espera
- gráfico de distribuição por modalidade
- gráfico de distribuição por período
- ranking das escolas com maior demanda

### Resultado esperado

- Todos os indicadores carregados
- Gráficos exibidos corretamente
- Ranking ordenado por demanda

---

## Fluxo 3 — Métricas das Escolas

### Passos

1. Acessar **Métricas das Escolas**

Verificar para cada escola:

- nome
- bairro
- modalidade
- endereço
- quantidade de vagas
- alunos em espera
- capacidade
- quantidade de salas
- períodos de funcionamento

### Resultado esperado

- Todas as escolas carregadas
- Informações consistentes
- Quantidade de vagas exibida corretamente

---

## Fluxo 4 — Gerenciar Escolas

### Passos

1. Acessar **Gerenciar Escolas**

Verificar:

- listagem das escolas
- botão **Editar dados**
- botão de exclusão
- botão **Nova Escola**
- botão **Importar CSV**

### Resultado esperado

- Todas as escolas listadas
- Ações disponíveis para cada escola
- Botões funcionando corretamente

---

## Fluxo 5 — Navegação

Verificar:

- Visão Geral
- Métricas das Escolas
- Gerenciar Escolas
- Lista de Espera
- Por Bairro
- Histórico
- Critérios de Fila
- Configurações
- Configurar Domínio

### Resultado esperado

- Todas as páginas acessíveis
- Menu lateral funcionando
- Item ativo destacado corretamente

---

## Fluxo 6 — Logout

### Passos

1. Clicar em **Sair**

### Resultado esperado

- Sessão encerrada
- Redirecionamento para a tela de login