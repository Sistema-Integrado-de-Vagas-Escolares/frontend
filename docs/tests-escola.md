# Testes — Painel da Escola

⏱ Tempo estimado: 10 minutos

![Tela inicial do Painel da Escola](https://res.cloudinary.com/hoekveld-dev/image/upload/v1783224811/sive/escola.png)

## Credenciais

**Código da Escola:**
EMEI-0012

**Senha:**
Escola@2026

---

## Fluxo 1 — Login

### Passos

1. Acessar [http://localhost:5173/escola](http://localhost:5173/escola)
2. Informar o código da escola
3. Informar a senha
4. Clicar em **"Acessar Painel"**

### Resultado esperado

- Login realizado com sucesso
- Dashboard (Início) carregado
- Menu lateral exibido com o nome da escola
- Indicadores de Espera, Vagas e Capacidade carregados

---

## Fluxo 2 — Início (Visão Geral)

Verificar:

- quantidade de alunos em espera
- quantidade de vagas disponíveis
- capacidade total da escola
- card **Lista de Espera** com total de alunos aguardando
- card **Responsáveis** com total de cadastrados
- card **Alunos** com total de registradas
- card **Buscar por CPF**

### Resultado esperado

- Todos os indicadores carregados
- Cards com contagens corretas
- Navegação para cada seção funcionando ao clicar no card

---

## Fluxo 3 — Lista de Espera

### Passos

1. Acessar **Lista de Espera**

Verificar:

- destaque do **Próximo da fila**
- prazos configurados (dias para contato, para matrícula e total)
- listagem dos alunos com posição, idade, critérios, período e pontuação
- botões **Chamar** e **Ver perfil** para alunos aguardando
- ao chamar um aluno, exibição do status **Chamado**, fase do processo e prazo restante
- botões **Aceite**, **Recusa** e **Desistência**
- ações **Repassar vaga — não compareceu no prazo**
- ação **Desfazer chamado — retornar para lista de espera**

### Resultado esperado

- Fila ordenada corretamente por pontuação
- Ações de chamada, aceite, recusa e desistência funcionando
- Prazos e status atualizados corretamente

---

## Fluxo 4 — Gestão de Vagas

### Passos

1. Acessar **Gestão de Vagas**

Verificar:

- vagas disponíveis
- alunos matriculados
- capacidade total
- campo **Nova quantidade de vagas disponíveis**
- campo **Motivo da atualização**
- botão **Confirmar atualização de vagas**
- histórico de atualizações de vagas (data, motivo e variação)

### Resultado esperado

- Atualização de vagas refletida nos indicadores
- Motivo obrigatório para confirmar a atualização
- Novo registro adicionado ao histórico de atualizações

---

## Fluxo 5 — Responsáveis

### Passos

1. Acessar **Responsáveis**

Verificar:

- listagem dos responsáveis cadastrados
- nome, CPF, quantidade de filhos e status de acesso (**Tem acesso** / **Sem acesso**)
- botão **Novo Responsável**

### Passos — Cadastro

1. Clicar em **Novo Responsável**
2. Preencher nome completo, CPF, telefone/WhatsApp e e-mail
3. Ativar (opcional) **Criar acesso ao portal do responsável**
4. Clicar em **Cadastrar Responsável**

### Passos — Perfil do responsável

1. Clicar em um responsável da listagem

Verificar:

- dados de contato (telefone e e-mail)
- status de acesso ao portal
- botões **Editar dados** e **Alterar senha**
- lista de **Filhos vinculados**
- botão **Vincular filho**
- botão **Cadastrar novo filho**

### Resultado esperado

- Responsável cadastrado com sucesso
- Dados exibidos corretamente no perfil
- Filhos vinculados listados corretamente

---

## Fluxo 6 — Alunos

### Passos

1. Acessar **Alunos**

Verificar:

- listagem dos alunos registrados
- nome, data de nascimento, tipo de vaga (creche/fundamental), quantidade de responsáveis
- posição na lista de espera (ex: #12º)
- botão **Cadastrar Aluno**

### Passos — Cadastro de aluno

1. Clicar em **Cadastrar Aluno**
2. Preencher nome, data de nascimento
3. Selecionar tipo de vaga (**Creche** ou **Fundamental**)
4. Selecionar período solicitado (**Integral**, **Manhã** ou **Tarde**)
5. Preencher endereço de residência
6. Selecionar faixa de renda familiar per capita
7. Ativar os critérios de pontuação aplicáveis:
   - Família em situação de vulnerabilidade socioeconômica
   - Responsável solo (mãe ou pai solteiro)
   - Aluno mora de aluguel
   - Beneficiário do Bolsa Família
   - Beneficiário do BPC/LOAS
   - Aluno com deficiência ou necessidade especial
   - Irmão já matriculado na mesma escola
8. Conferir a **pontuação estimada**
9. Vincular responsável(is) por CPF
10. Clicar em **Cadastrar na lista de espera**

### Resultado esperado

- Pontuação recalculada automaticamente conforme critérios ativados
- Aluno cadastrado e adicionado à Lista de Espera
- Responsável vinculado corretamente ao aluno

---

## Fluxo 7 — Buscar por CPF

### Passos

1. Acessar **Buscar por CPF**
2. Informar o CPF do responsável
3. Clicar em **Buscar no Sistema**

Verificar:

- confirmação **Responsável encontrado**
- nome, CPF, telefone e e-mail
- status **Tem acesso ao portal**
- botão **Ver perfil completo**
- botão **Alterar senha**

### Passos — Alterar senha

1. Clicar em **Alterar senha**
2. Preencher **Nova senha** (mínimo 8 caracteres)
3. Preencher **Confirmar senha**
4. Clicar em **Salvar nova senha**

### Resultado esperado

- Busca retorna o responsável correto
- Modal de alteração de senha abre corretamente
- Senha alterada com sucesso

---

## Fluxo 8 — Navegação

Verificar:

- Início
- Lista de Espera
- Gestão de Vagas
- Histórico
- Responsáveis
- Alunos
- Buscar por CPF

### Resultado esperado

- Todas as páginas acessíveis
- Menu lateral funcionando
- Item ativo destacado corretamente

---

## Fluxo 9 — Logout

### Passos

1. Clicar em **Sair**

### Resultado esperado

- Sessão encerrada
- Redirecionamento para a tela de login