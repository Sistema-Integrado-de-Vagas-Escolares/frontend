
## SIVE Frontend

Interface web do Sistema Integrado de Vagas Escolares (SIVE), criada com Vite, React e componentes em TypeScript.

### Requisitos

- Node.js 18 ou superior
- npm 9+ ou pnpm 9+

### Instalacao

1. Abra um terminal na pasta `frontend`.
2. Instale as dependencias:

```bash
npm install
```

Se preferir usar pnpm:

```bash
pnpm install
```

### Executar em desenvolvimento

Inicie o servidor local com:

```bash
npm run dev
```

O Vite vai disponibilizar a aplicacao em `http://localhost:5173` por padrao.

### Gerar build de producao

Para validar a compilacao final do frontend:

```bash
npm run build
```

### Publicar na Cloudflare Pages

O frontend esta preparado para Cloudflare Pages.

1. Gere o build de producao.
2. Publique a pasta `dist` com Wrangler:

```bash
npm run deploy:pages
```

Esse comando usa `wrangler pages deploy dist --project-name sive-frontend`.

### Rotas SPA

O arquivo `public/_redirects` garante que rotas como `/prefeitura` e `/mapa` sejam carregadas corretamente quando acessadas direto pela URL na Cloudflare Pages.

### Estrutura principal

- `src/main.tsx`: ponto de entrada da aplicacao
- `src/app/App.tsx`: composicao principal da interface
- `src/app/routes.ts`: definicao de rotas
- `src/app/pages/`: telas principais do sistema
- `src/app/components/`: componentes reutilizaveis e UI base
- `src/styles/`: estilos globais, tema, fontes e Tailwind
- `public/_redirects`: fallback de SPA para Cloudflare Pages

### Observacoes para a banca

- O projeto foi preparado para ser executado localmente sem configuracao adicional de build tools.
- O projeto pode ser publicado diretamente na Cloudflare Pages sem backend adicional para a camada de interface.
- Caso a interface precise consumir a API, verifique se o backend do SIVE esta rodando em paralelo e se as URLs de acesso estao configuradas no codigo da aplicacao.
- As imagens e telas do sistema ja estao organizadas dentro da estrutura atual do projeto para facilitar a navegacao durante a avaliacao.

### Origem do layout

Este frontend foi baseado no material de design do SIVE disponivel no Figma original do projeto.
  