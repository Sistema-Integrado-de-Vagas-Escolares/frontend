# Testes — Portal dos Responsáveis

⏱ Tempo estimado: 5 minutos

![Tela inicial do Portal dos Responsáveis](https://res.cloudinary.com/hoekveld-dev/image/upload/v1783225436/sive/responsavel.png)

## Credenciais

**CPF do Responsável:**
123.456.789-00

**Senha:**
Resp@2026

---

## Fluxo 1 — Login

### Passos

1. Acessar [http://localhost:5173/responsavel](http://localhost:5173/responsavel)
2. Informar o CPF do responsável
3. Informar a senha
4. Clicar em **"Entrar"**

### Resultado esperado

- Login realizado com sucesso
- Redirecionamento para a página **"Olá, [Nome do Responsável]"**
- CPF e data de última atualização exibidos
- Solicitações na lista de espera carregadas

### Verificações adicionais

- Link **"← Central de Vagas"** disponível para retornar à página pública
- Link **"Esqueceu a senha? Recuperar acesso"** disponível
- Aviso de proteção de dados (LGPD) exibido

---

## Fluxo 2 — Página Inicial (Minhas Solicitações)

Verificar:

- nome e CPF do responsável logado
- data da última atualização
- card para cada filho com solicitação na lista de espera:
  - nome da criança
  - idade, modalidade (creche/fundamental) e período
  - escola solicitada
  - status (**Em espera** / **Chamado**)
  - posição na fila (quando em espera)
  - barra de progresso com percentual de crianças já atendidas
  - alerta de **vaga disponível** (quando chamado)
- aviso sobre notificações de mudança de posição
- botão **Sair**

### Resultado esperado

- Todos os filhos vinculados ao responsável são listados
- Status e posição exibidos corretamente
- Alerta de vaga disponível destacado quando aplicável

---

## Fluxo 3 — Detalhe do Filho (Em espera)

### Passos

1. Clicar em um filho com status **Em espera** (ex.: Lucas Oliveira)

Verificar:

- situação, escola solicitada, modalidade e período
- posição atual na fila e total de inscritos na lista de espera
- barra de progresso com percentual de crianças já atendidas
- pontuação ponderada geral
- detalhamento **"Por que estou nessa posição?"** com critérios, pesos e notas:
  - renda familiar
  - distância da residência
  - mãe trabalhadora
  - irmão na escola
- histórico de movimentações (posição atualizada, inscrição confirmada, cadastro realizado)
- posições vizinhas (à frente e atrás), com o critério de destaque de cada uma
- lista de documentação necessária para matrícula

### Resultado esperado

- Dados consistentes com os exibidos na página inicial
- Pontuação e pesos exibidos corretamente
- Histórico em ordem cronológica decrescente
- Navegação via breadcrumb **"Meus filhos / [Nome]"** funcionando

---

## Fluxo 4 — Detalhe do Filho (Chamado / Vaga disponível)

### Passos

1. Clicar em um filho com status **Chamado** (ex.: Ana Oliveira)

Verificar:

- selo de situação **Chamado**
- alerta **"Vaga disponível!"** com prazo de confirmação
- pontuação ponderada e detalhamento dos critérios
- histórico de movimentações incluindo o evento de chamada para confirmação
- lista de documentação necessária para matrícula

### Resultado esperado

- Alerta de vaga disponível exibido com destaque (cor de atenção)
- Prazo de confirmação exibido corretamente
- Histórico refletindo o evento mais recente no topo

---

## Fluxo 5 — Navegação

Verificar:

- **Voltar ao portal** (da tela de detalhe do filho para a página inicial)
- **Meus filhos** (breadcrumb) retornando à listagem
- **Central de Vagas** (retorno à página pública, a partir do login)

### Resultado esperado

- Todas as rotas acessíveis
- Retorno correto para a página anterior em cada link

---

## Fluxo 6 — Logout

### Passos

1. Clicar em **Sair**

### Resultado esperado

- Sessão encerrada
- Redirecionamento para a tela de login do Portal dos Responsáveis