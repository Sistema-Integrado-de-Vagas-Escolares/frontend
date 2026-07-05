# Testes — Painel Administrativo SIVE

⏱ **Tempo estimado:** 5 minutos

![Tela inicial do painel administrativo SIVE](https://res.cloudinary.com/hoekveld-dev/image/upload/v1783222262/sive/sive-admin.png)

## Credenciais

**E-mail:**

[admin@sive.com.br](mailto:admin@sive.com.br)

**Senha:**

Sive@Admin2026

---

## Fluxo 1 — Login

### Passos

1. Abra o endereço em uma nova aba do navegador http://localhost:5173/sive-admin.
2. Informe as credenciais.
3. Clique em **"Acessar painel administrativo"**.

### Resultado esperado

* Login realizado com sucesso.
* Dashboard exibido.
* Estatísticas carregadas.

---

## Fluxo 2 — Dashboard

Verifique:

* quantidade de prefeituras;
* quantidade de escolas;
* prefeituras ativas;
* prefeituras aguardando ativação.

---

## Fluxo 3 — Cadastro de prefeitura

### Passos

1. Clique em **"Nova prefeitura"**.
2. Preencha os campos obrigatórios.
3. Clique em **Salvar**.

### Resultado esperado

* Prefeitura criada com sucesso.
* Credenciais geradas.
* Módulos habilitados.

---

## Fluxo 4 — Editar prefeitura

### Passos

1. Clique em **"Editar"** na prefeitura desejada.
2. Altere os campos desejados.
3. Clique em **Salvar**.

### Resultado esperado

* Prefeitura atualizada com sucesso.
* Alterações refletidas na listagem.

---

## Fluxo 5 — Redefinir senha

### Passos

1. Clique em **"Redefinir senha"** na prefeitura desejada.
2. Confirme a ação.
3. Clique em **Salvar**.

### Resultado esperado

* Senha redefinida com sucesso.

---

## Fluxo 6 — Logout

### Passos

1. Clique em **Sair**.

### Resultado esperado

* Sessão encerrada.
* Redirecionamento para a tela de login.
