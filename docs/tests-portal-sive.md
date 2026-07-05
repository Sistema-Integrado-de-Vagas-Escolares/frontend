# Testes — Portal SIVE (Login e Seleção de Módulos)

⏱ Tempo estimado: 5 minutos

![Tela inicial do Portal SIVE](https://res.cloudinary.com/hoekveld-dev/image/upload/v1783226406/sive/portal-sive.png)

## Credenciais

**E-mail institucional:**
admin@caraguatatuba.sp.gov.br

**Senha:**
Admin@2026

---

## Fluxo 1 — Login

### Passos

1. Acessar [http://localhost:5173/portal](http://localhost:5173/portal)
2. Informar o e-mail institucional
3. Informar a senha
4. Clicar em **"Acessar o SIVE"**

### Resultado esperado

- Login realizado com sucesso
- Redirecionamento para a tela **"Selecione o módulo de acesso"**
- Nome do município e brasão exibidos corretamente no cabeçalho

### Verificações adicionais (tela de login)

- Logo e nome **SIVE** exibidos
- Texto institucional **"Sistema Integrado de Vagas Escolares"** e descrição da plataforma
- Lista de funcionalidades exibida:
  - Painel da Prefeitura com indicadores estratégicos para vagas
  - Gestão da lista de espera pelas escolas
  - Consulta da lista de espera para responsáveis
  - Mapa público de vagas por região
- Bloco de recuperação de senha exibindo o contato **suporte@sive.com.br**
- Aviso de segurança/LGPD exibido no rodapé

---

## Fluxo 2 — Validações de login

### Passos

1. Tentar acessar com e-mail inválido ou vazio
2. Tentar acessar com senha incorreta
3. Tentar acessar com os campos em branco

### Resultado esperado

- Mensagens de erro exibidas para cada cenário inválido
- Login não é concluído em nenhum dos casos acima
- Nenhuma informação sensível exposta na mensagem de erro

---

## Fluxo 3 — Tela de Seleção de Módulos

### Passos

1. Realizar login com sucesso

Verificar:

- cabeçalho com brasão, **"Prefeitura Municipal"**, nome do município e estado
- aviso de autenticação e proteção de dados (LGPD)
- botão **Sair** no canto superior direito
- seção **"Selecione o módulo de acesso"** com os cards:
  - **Painel da Prefeitura** (tag Gestão)
  - **Painel da Escola** (tag Escolas)
  - **Portal dos Responsáveis** (tag Público)
  - **Mapa Inteligente de Vagas** (tag Público)
  - **Central de Vagas Escolares** (tag Site Público)

### Resultado esperado

- Todos os cards carregados com título, tag, descrição e seta de acesso
- Tags exibidas corretamente conforme o tipo de módulo (Gestão / Escolas / Público / Site Público)

---

## Fluxo 4 — Navegação para cada módulo

### Passos

1. Clicar no card **Painel da Prefeitura**
2. Voltar e clicar no card **Painel da Escola**
3. Voltar e clicar no card **Portal dos Responsáveis**
4. Voltar e clicar no card **Mapa Inteligente de Vagas**
5. Voltar e clicar no card **Central de Vagas Escolares**

### Resultado esperado

- Cada card redireciona corretamente para seu respectivo módulo:
  - Painel da Prefeitura → login/dashboard administrativo da prefeitura
  - Painel da Escola → login/dashboard da escola
  - Portal dos Responsáveis → tela de login do portal (CPF e senha)
  - Mapa Inteligente de Vagas → mapa público de vagas
  - Central de Vagas Escolares → página pública inicial
- Nenhum link quebrado ou redirecionamento incorreto

---

## Fluxo 5 — Logout

### Passos

1. Na tela de seleção de módulos, clicar em **Sair**

### Resultado esperado

- Sessão encerrada
- Redirecionamento para a tela de login do SIVE