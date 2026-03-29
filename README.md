<div align="center">

# ⚡ TaskFlow

**Gerenciador de tarefas colaborativo para equipes de producao audiovisual.**

Desenvolvido como desafio tecnico para o processo seletivo de
**Desenvolvedor Fullstack Junior** na [Watch](https://descubra.watch.tv.br/sobre-a-watch/).

![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker&logoColor=white)
![Jest](https://img.shields.io/badge/Testes-Jest-C21325?style=flat-square&logo=jest&logoColor=white)

<br/>

![TaskFlow Demo](taskflow.gif)

</div>

---

## 🎯 Sobre o Projeto

O **TaskFlow** e um sistema de gerenciamento de tarefas colaborativo onde toda a equipe trabalha no mesmo ambiente compartilhado.

- 👁️ **Todos veem tudo** — qualquer usuario acessa todas as tarefas e categorias
- 🔒 **Permissoes por criador** — somente quem criou pode editar ou excluir
- ⚡ **Tempo real via SSE** — atualizacoes aparecem instantaneamente para todos, sem recarregar a pagina

---

## 🛠️ Tecnologias

<table>
<tr>
<td valign="top" width="33%">

### ⚙️ Backend
- **Node.js 20** + **Fastify**
- **Prisma ORM** + **PostgreSQL 16**
- **JWT** para autenticacao
- **SSE** para tempo real
- **Swagger** — documentacao da API
- **Jest** — testes unitarios

</td>
<td valign="top" width="33%">

### 🎨 Frontend
- **Vue 3** + **Vite**
- **Vuetify 3** — Material Design
- **Pinia** — estado global
- **Vue Router** — navegacao SPA
- **Axios** — requisicoes HTTP

</td>
<td valign="top" width="33%">

### 🐳 Infra
- **Docker** + **Docker Compose**
- **nginx** — serve o frontend e faz proxy reverso para a API
- Migracoes automaticas na inicializacao

</td>
</tr>
</table>

---

## ✨ Funcionalidades

| | Funcionalidade |
|---|---|
| 🔐 | Cadastro e login com JWT |
| ✅ | CRUD completo de tarefas com titulo, descricao, status, prioridade, categoria, responsavel e prazo |
| 🏷️ | Categorias com cores personalizadas via color picker |
| 📊 | Dashboard com contadores de tarefas por status |
| 📈 | Relatorios: total, concluidas, vencidas, distribuicao por status e prioridade |
| 🔍 | Filtros por texto, status, prioridade, categoria e responsavel |
| ⚡ | Atualizacoes em tempo real via SSE para tarefas e categorias |
| 🛡️ | Permissoes por propriedade: somente o criador edita ou exclui |
| ℹ️ | Pagina Sobre com guia de uso do sistema |

---

## 🚀 Como Executar

### 🐳 Com Docker (recomendado)

> Pre-requisito: [Docker](https://www.docker.com/) instalado.

```bash
# 1. Clone o repositorio
git clone https://github.com/Gabriieelcosta/CineMax.git
cd CineMax

# 2. Configure as variaveis de ambiente
cp backend/.env.example backend/.env

# 3. Suba todos os servicos
docker compose up --build
```

**Acesse em:** http://localhost

O Docker sobe automaticamente:

| Servico | Porta |
|---|---|
| 🌐 Frontend (nginx) | http://localhost |
| ⚙️ Backend (Fastify) | http://localhost:3000 |
| 📖 Swagger (docs) | http://localhost:3000/docs |
| 🗄️ PostgreSQL | porta 5432 |

> As migracoes do banco sao executadas automaticamente na inicializacao do backend.

---

### 💻 Sem Docker (desenvolvimento local)

> Pre-requisitos: Node.js 20+ e PostgreSQL rodando localmente.

```bash
# Backend
cd backend
cp .env.example .env      # edite com suas credenciais
npm install
npx prisma migrate deploy
npm start
```

```bash
# Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

**Acesse em:** http://localhost:5173

---

### ☁️ Arquitetura Serverless — AWS Lambda

O backend foi projetado para rodar tanto via Docker quanto como funcao **AWS Lambda**, usando o pacote `serverless-http` que adapta o Fastify para o ambiente serverless.

> Devido ao prazo de entrega do desafio, optei por entregar o ambiente completo funcionando via Docker. Porem a estrutura para deploy na AWS ja esta implementada e pronta para uso.

**Como funciona:**

```
Requisicao HTTP
      ↓
AWS API Gateway   ← recebe a requisicao
      ↓
AWS Lambda        ← executa o handler.js (Fastify adaptado)
      ↓
Banco de dados    ← PostgreSQL (ex: AWS RDS)
```

O arquivo `handler.js` e o ponto de entrada para o Lambda:

```js
// handler.js
const serverless = require('serverless-http')
const { buildApp } = require('./server')

module.exports.handler = async (event, context) => {
  const app = await buildApp()
  return serverless(app)(event, context)
}
```

O `serverless.yml` define toda a infraestrutura na AWS:

```yaml
functions:
  api:
    handler: handler.main
    events:
      - httpApi:
          path: /{proxy+}   # todas as rotas da API
          method: ANY
```

**Pre-requisitos para deploy:**

```bash
npm install -g serverless
aws configure   # configure suas credenciais AWS
```

**Comandos de deploy:**

```bash
cd backend

# Testar localmente simulando o Lambda
npx serverless offline

# Deploy na AWS
npx serverless deploy --stage prod
```

> O banco de dados em producao deve ser um PostgreSQL acessivel pela Lambda, como o **AWS RDS** ou **Supabase**. A variavel `DATABASE_URL` deve apontar para esse banco nas variaveis de ambiente da Lambda.

---

## 🔑 Variaveis de Ambiente

Arquivo: `backend/.env`

```env
DATABASE_URL="postgresql://cinemax:cinemax123@localhost:5432/cinemax_db"

NODE_ENV=development
PORT=3000

JWT_SECRET=sua_chave_secreta
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173,http://localhost
```

---

## 📖 Documentacao da API

Com o backend rodando, acesse o **Swagger UI** em:

```
http://localhost:3000/docs
```

### 🔐 Autenticacao

| Metodo | Rota | Descricao |
|--------|------|-----------|
| `POST` | `/auth/register` | Cadastrar novo usuario |
| `POST` | `/auth/login` | Login — retorna token JWT |

### 👤 Usuarios

| Metodo | Rota | Descricao | Auth |
|--------|------|-----------|------|
| `GET` | `/users/me` | Perfil do usuario autenticado | ✅ |
| `GET` | `/users` | Listar todos os usuarios | ✅ |
| `PUT` | `/users/me` | Atualizar nome ou senha | ✅ |

### ✅ Tarefas

| Metodo | Rota | Descricao | Auth |
|--------|------|-----------|------|
| `GET` | `/tasks` | Listar tarefas (com filtros opcionais) | ✅ |
| `GET` | `/tasks/:id` | Detalhes de uma tarefa | ✅ |
| `POST` | `/tasks` | Criar nova tarefa | ✅ |
| `PUT` | `/tasks/:id` | Atualizar tarefa (somente criador) | ✅ |
| `DELETE` | `/tasks/:id` | Excluir tarefa (somente criador) | ✅ |
| `POST` | `/tasks/:id/collaborators` | Adicionar colaborador | ✅ |

**Filtros disponiveis em `GET /tasks`:**

| Parametro | Valores |
|-----------|---------|
| `status` | `PENDING` `IN_PROGRESS` `DONE` `CANCELLED` |
| `priority` | `LOW` `MEDIUM` `HIGH` |
| `categoryId` | ID da categoria |
| `assigneeId` | ID do responsavel |

### 🏷️ Categorias

| Metodo | Rota | Descricao | Auth |
|--------|------|-----------|------|
| `GET` | `/categories` | Listar todas as categorias | ✅ |
| `POST` | `/categories` | Criar categoria | ✅ |
| `PUT` | `/categories/:id` | Atualizar (somente criador) | ✅ |
| `DELETE` | `/categories/:id` | Excluir (somente criador) | ✅ |

### 📈 Relatorios

| Metodo | Rota | Descricao | Auth |
|--------|------|-----------|------|
| `GET` | `/reports/summary` | Total, vencidas, por status e prioridade | ✅ |

### ⚡ Tempo Real (SSE)

| Metodo | Rota | Descricao |
|--------|------|-----------|
| `GET` | `/events?token=<jwt>` | Stream de eventos em tempo real |

> O `EventSource` nativo do browser nao suporta headers customizados.
> Por isso o token JWT e enviado via query string nesta rota especifica.

---

## 🛡️ Modelo de Permissoes

| Acao | Qualquer usuario | Somente o criador |
|------|:---:|:---:|
| Ver tarefas e categorias | ✅ | |
| Criar tarefas e categorias | ✅ | |
| Editar tarefa | | ✅ |
| Excluir tarefa | | ✅ |
| Editar categoria | | ✅ |
| Excluir categoria | | ✅ |

> Na interface, os botoes ficam desabilitados para quem nao e o criador, com tooltip explicativo ao passar o mouse.

---

## ⚡ Tempo Real com SSE

O sistema usa **Server-Sent Events** para propagar mudancas a todos os clientes conectados — sem polling, sem WebSocket.

**Como funciona:**

```
Login do usuario
      │
      ▼
Abre conexao persistente  ──►  GET /events?token=<jwt>
      │
      ▼
Backend mantem mapa de clientes em memoria
      │
      ▼
Usuario cria/edita/exclui tarefa ou categoria
      │
      ▼
Backend faz broadcast para todos os clientes
      │
      ▼
Frontend atualiza o estado local sem recarregar a pagina
```

**Eventos emitidos:**

| Evento | Quando |
|--------|--------|
| `task:created` | Nova tarefa criada |
| `task:updated` | Tarefa editada |
| `task:deleted` | Tarefa excluida |
| `category:created` | Nova categoria criada |
| `category:updated` | Categoria editada |
| `category:deleted` | Categoria excluida |

O chip **⚡ Ao vivo** no canto superior direito mostra o status da conexao. Fica offline somente se o servidor reiniciar ou a rede cair — reconecta automaticamente em 5 segundos.

> **Decisao tecnica:** o `reply.raw.writeHead()` do Fastify bypassa o middleware de CORS, entao os headers `Access-Control-Allow-Origin` sao adicionados manualmente na propria resposta SSE.

---

## 🧪 Testes

```bash
cd backend
npm test
```

Cobertura atual:

| Suite | O que testa |
|-------|-------------|
| `errors.test.js` | Classes de erro HTTP: `AppError`, `NotFoundError`, `UnauthorizedError`, `ForbiddenError` |
| `hash.test.js` | Utilitarios de senha: `hashPassword`, `comparePassword` (bcrypt) |

---

## 📁 Estrutura do Projeto

```
CineMax/
  backend/
    src/
      config/        # Banco, JWT, Swagger
      controllers/   # Handlers das rotas
      middlewares/   # Autenticacao, tratamento de erros
      repositories/  # Acesso ao banco via Prisma
      routes/        # Definicao das rotas Fastify
      services/      # Regras de negocio
      utils/         # Erros customizados, hash
    tests/
      unit/          # Testes unitarios (Jest)
    prisma/          # Schema e migracoes
  frontend/
    src/
      components/    # Componentes reutilizaveis
      layouts/       # DefaultLayout, AuthLayout
      pages/         # Paginas da aplicacao
      router/        # Vue Router
      services/      # Chamadas a API (Axios)
      stores/        # Estado global (Pinia)
    public/          # Favicon e assets estaticos
  docker-compose.yml
  README.md
```

---

## 🔮 Melhorias Futuras

<details>
<summary>🔴 Alta prioridade</summary>

| Melhoria | Descricao |
|----------|-----------|
| 👑 Role de Administrador | Conta com permissao para editar/excluir qualquer conteudo do sistema |
| 🔑 Recuperacao de senha | Fluxo de reset via e-mail com token temporario |
| 📄 Paginacao | A listagem atual carrega todas as tarefas de uma vez |

</details>

<details>
<summary>🟡 Funcionalidades</summary>

| Melhoria | Descricao |
|----------|-----------|
| 🗂️ Visualizacao Kanban | Arrastar e soltar tarefas entre colunas de status |
| 💬 Comentarios em tarefas | Historico de discussoes dentro de cada tarefa |
| 🔔 Notificacoes de vencimento | Alerta quando uma tarefa esta proxima do prazo |
| 📝 Log de atividade | Registro de quem alterou o que e quando |
| 👥 Colaboradores no frontend | O backend ja suporta o modelo — falta a interface |
| 👤 Perfil do usuario | O backend ja tem `PUT /users/me` — falta a tela no frontend |

</details>

<details>
<summary>🟢 Tecnico</summary>

| Melhoria | Descricao |
|----------|-----------|
| 🧪 Testes de integracao | Testes das rotas do backend com supertest |
| 🔄 Refresh token | O JWT atual expira sem renovacao automatica |
| ⚙️ CI/CD | Pipeline de build e deploy automatico |
| 📊 Graficos visuais | Substituir listas por graficos de barra/pizza (Chart.js) |
| 📤 Exportar relatorio | Gerar PDF ou Excel com os dados |

</details>

---

## 🌿 Git Flow

```
main
 └── feature/backend       # Estrutura inicial do servidor
 └── feature/frontend      # Estrutura inicial da interface
 └── release/v1            # Primeira versao funcional
 └── fix/bugs-v1           # Correcoes pos v1
 └── release/v2            # Segunda versao com melhorias de UX
 └── fix/bugs-v2           # SSE, Docker, permissoes, filtros
 └── release/v3            # Versao final
```

---

<div align="center">

Projeto desenvolvido por [**Gabriel Costa**](https://www.linkedin.com/in/devfullstackgabriieelcosta/).

</div>
