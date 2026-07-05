# Testes — Painel da Escola

⏱ **Tempo estimado:** 10 minutos

![Tela inicial do Painel da Escola](https://res.cloudinary.com/hoekveld-dev/image/upload/v1783224811/sive/escola.png)

## Credenciais

**Código da Escola:**

EMEI-0012

**Senha:**

Escola@2026

---

## Fluxo 1 — Login

### Passos

1. Acesse http://localhost:5173/escola.
2. Informe o código da escola.
3. Informe a senha.
4. Clique em **"Acessar Painel"**.

### Resultado esperado

* Login realizado com sucesso.
* Dashboard (**Início**) carregado.
* Menu lateral exibido com o nome da escola.
* Indicadores de Espera, Vagas e Capacidade carregados corretamente.

---

## Fluxo 2 — Início (Visão Geral)

### Verificações

Verifique:

* quantidade de alunos em espera;
* quantidade de vagas disponíveis;
* capacidade total da escola;
* card **Lista de Espera** com o total de alunos aguardando;
* card **Responsáveis** com o total de responsáveis cadastrados;
* card **Alunos** com o total de alunos cadastrados;
* card **Buscar por CPF**.

### Resultado esperado

* Todos os indicadores são carregados corretamente.
* Os cards exibem as contagens corretas.
* A navegação para cada seção funciona ao clicar no respectivo card.

---

## Fluxo 3 — Lista de Espera

### Passos

1. Acesse **Lista de Espera**.

### Verificações

Verifique:

* destaque do **Próximo da fila**;
* prazos configurados (dias para contato, matrícula e prazo total);
* listagem dos alunos com posição, idade, critérios, período e pontuação;
* botões **Chamar** e **Ver perfil** para os alunos aguardando atendimento;
* após chamar um aluno, exibição do status **Chamado**, da fase do processo e do prazo restante;
* botões **Aceite**, **Recusa** e **Desistência**;
* ação **Repassar vaga — não compareceu no prazo**;
* ação **Desfazer chamado — retornar para a lista de espera**.

### Resultado esperado

* A fila é ordenada corretamente por pontuação.
* As ações de chamada, aceite, recusa e desistência funcionam corretamente.
* Os prazos e status são atualizados corretamente.

---

## Fluxo 4 — Gestão de Vagas

### Passos

1. Acesse **Gestão de Vagas**.

### Verificações

Verifique:

* vagas disponíveis;
* alunos matriculados;
* capacidade total;
* campo **Nova quantidade de vagas disponíveis**;
* campo **Motivo da atualização**;
* botão **Confirmar atualização de vagas**;
* histórico de atualizações de vagas (data, motivo e variação).

### Resultado esperado

* A atualização das vagas é refletida nos indicadores.
* O motivo é obrigatório para confirmar a atualização.
* Um novo registro é adicionado ao histórico de atualizações.

---

## Fluxo 5 — Responsáveis

### Passos

1. Acesse **Responsáveis**.

### Verificações

Verifique:

* listagem dos responsáveis cadastrados;
* nome, CPF, quantidade de filhos e status de acesso (**Tem acesso** / **Sem acesso**);
* botão **Novo Responsável**.

### Passos — Cadastro

1. Clique em **Novo Responsável**.
2. Preencha o nome completo, CPF, telefone/WhatsApp e e-mail.
3. Ative, opcionalmente, **Criar acesso ao portal do responsável**.
4. Clique em **Cadastrar Responsável**.

### Passos — Perfil do responsável

1. Clique em um responsável da listagem.

### Verificações

Verifique:

* dados de contato (telefone e e-mail);
* status de acesso ao portal;
* botões **Editar dados** e **Alterar senha**;
* lista de **Filhos vinculados**;
* botão **Vincular filho**;
* botão **Cadastrar novo filho**.

### Resultado esperado

* Responsável cadastrado com sucesso.
* Dados exibidos corretamente no perfil.
* Filhos vinculados listados corretamente.

---

## Fluxo 6 — Alunos

### Passos

1. Acesse **Alunos**.

### Verificações

Verifique:

* listagem dos alunos cadastrados;
* nome, data de nascimento, tipo de vaga (Creche ou Ensino Fundamental) e quantidade de responsáveis;
* posição na lista de espera (ex.: **12º**);
* botão **Cadastrar Aluno**.

### Passos — Cadastro de aluno

1. Clique em **Cadastrar Aluno**.
2. Preencha o nome e a data de nascimento.
3. Selecione o tipo de vaga (**Creche** ou **Ensino Fundamental**).
4. Selecione o período solicitado (**Integral**, **Manhã** ou **Tarde**).
5. Preencha o endereço de residência.
6. Selecione a faixa de renda familiar per capita.
7. Ative os critérios de pontuação aplicáveis:

   * Família em situação de vulnerabilidade socioeconômica;
   * Responsável solo (mãe ou pai solteiro);
   * Aluno residente em imóvel alugado;
   * Beneficiário do Bolsa Família;
   * Beneficiário do BPC/LOAS;
   * Aluno com deficiência ou necessidade especial;
   * Irmão já matriculado na mesma escola.
8. Confira a **pontuação estimada**.
9. Vincule um ou mais responsáveis pelo CPF.
10. Clique em **Cadastrar na lista de espera**.

### Resultado esperado

* A pontuação é recalculada automaticamente conforme os critérios selecionados.
* O aluno é cadastrado e adicionado à Lista de Espera.
* O responsável é vinculado corretamente ao aluno.

---

## Fluxo 7 — Buscar por CPF

### Passos

1. Acesse **Buscar por CPF**.
2. Informe o CPF do responsável.
3. Clique em **Buscar no Sistema**.

### Verificações

Verifique:

* confirmação **Responsável encontrado**;
* nome, CPF, telefone e e-mail;
* status **Tem acesso ao portal**;
* botão **Ver perfil completo**;
* botão **Alterar senha**.

### Passos — Alterar senha

1. Clique em **Alterar senha**.
2. Preencha o campo **Nova senha** (mínimo de 8 caracteres).
3. Preencha o campo **Confirmar senha**.
4. Clique em **Salvar nova senha**.

### Resultado esperado

* A busca retorna o responsável correto.
* O modal de alteração de senha é exibido corretamente.
* A senha é alterada com sucesso.

---

## Fluxo 8 — Navegação

### Verificações

Verifique o acesso às seguintes páginas:

* Início;
* Lista de Espera;
* Gestão de Vagas;
* Histórico;
* Responsáveis;
* Alunos;
* Buscar por CPF.

### Resultado esperado

* Todas as páginas estão acessíveis.
* O menu lateral funciona corretamente.
* O item correspondente à página atual permanece destacado.

---

## Fluxo 9 — Logout

### Passos

1. Clique em **Sair**.

### Resultado esperado

* Sessão encerrada.
* Redirecionamento para a tela de login.
