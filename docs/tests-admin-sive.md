# Testes — Painel Administrativo SIVE

⏱ Tempo estimado: 5 minutos

![Tela inicial do painel administrativo SIVE](https://res.cloudinary.com/hoekveld-dev/image/upload/v1783222262/sive/sive-admin.png)

## Credenciais

Email:
admin@sive.com.br

Senha:
Sive@Admin2026

---

## Fluxo 1 — Login

### Passos

1. Acessar [http://localhost:5173/sive-admin](http://localhost:5173/sive-admin)
2. Informar as credenciais
3. Clicar em "Acessar painel administrativo"

### Resultado esperado

- Login realizado
- Dashboard exibido
- Estatísticas carregadas

---

## Fluxo 2 — Dashboard

Verificar:

- quantidade de prefeituras
- quantidade de escolas
- prefeituras ativas
- aguardando ativação

---

## Fluxo 3 — Cadastro de prefeitura

1. Clicar em "Nova prefeitura"
2. Preencher os campos obrigatórios
3. Salvar

Resultado esperado:

- prefeitura criada
- credenciais geradas
- módulos habilitados

---

## Fluxo 4 — Editar prefeitura

1. Clicar em "Editar" na prefeitura desejada
2. Alterar os campos desejados
3. Salvar

Resultado esperado:

- prefeitura atualizada
- alterações refletidas na listagem

---

## Fluxo 5 — Redefinir senha

1. Clicar em "Redefinir senha" na prefeitura desejada
2. Confirmar a ação
3. Salvar

Resultado esperado:

- senha redefinida

## Fluxo 6 — Logout

### Passos

1. Clicar em **Sair**

### Resultado esperado

- Sessão encerrada
- Redirecionamento para a tela de login