## SIVE Frontend

Interface web do Sistema Integrado de Vagas Escolares (SIVE), criada com Vite, React e componentes em TypeScript.

### Requisitos

- Node.js 18 ou superior
- npm 9+ ou pnpm 9+

### Instalacao

Clone o repositorio e acesse a pasta `frontend`:

```bash
git clone https://github.com/Sistema-Integrado-de-Vagas-Escolares/frontend.git
cd frontend
```

Instale as dependencias do projeto:

```bash
npm install
```

### Executar em desenvolvimento

Inicie o servidor local com:

```bash
npm run dev
```

### 🧪 Documentação para avaliação

Cada perfil do sistema possui um documento próprio contendo:

- credenciais de acesso;
- fluxos de teste;
- funcionalidades disponíveis;
- resultados esperados;
- capturas de tela da interface.

Acesse os documentos de teste para cada perfil, na ordem sugerida de navegação:

⏱ Tempo estimado: 53 minutos

| Ordem | Área | Documento |
| ----- | ---- | --------- |
| 1 | Administração do SIVE | [docs/tests-admin-sive.md](docs/tests-admin-sive.md) |
| 2 | Portal SIVE (login e seleção de módulos) | [docs/tests-portal-sive.md](docs/tests-portal-sive.md) |
| 3 | Prefeitura | [docs/tests-prefeitura.md](docs/tests-prefeitura.md) |
| 4 | Escola | [docs/tests-escola.md](docs/tests-escola.md) |
| 5 | Central de Vagas | [docs/tests-central-vagas.md](docs/tests-central-vagas.md) |
| 6 | Mapa Inteligente | [docs/tests-mapa.md](docs/tests-mapa.md) |
| 7 | Responsáveis | [docs/tests-responsavel.md](docs/tests-responsavel.md) |

### Estrutura do projeto

```plaintext
src/
 ├── app/
 │   ├── components/
 │   ├── pages/
 │   ├── routes.ts
 │   └── App.tsx
 ├── styles/
 └── main.tsx

public/
 └── _redirects

docs/
 └── tests-*.md
```

### Observações para a banca

O frontend pode ser executado localmente sem configuração adicional.
O deploy está preparado para Cloudflare Pages.
Caso seja necessário testar integrações, execute o backend em paralelo.
Toda a documentação dos fluxos de teste está disponível na pasta docs.