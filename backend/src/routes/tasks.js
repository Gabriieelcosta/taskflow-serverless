const { getAll, getById, create, update, remove, addCollaborator } = require('../controllers/taskController')
const { authenticate } = require('../middlewares/auth')

async function taskRoutes(fastify) {
  fastify.get('/tasks', {
    preHandler: authenticate,
    schema: {
      tags: ['Tasks'],
      summary: 'Listar tarefas do usuário (com filtros opcionais)',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'DONE', 'CANCELLED'] },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
          categoryId: { type: 'string' },
        },
      },
    },
  }, getAll)

  fastify.get('/tasks/:id', {
    preHandler: authenticate,
    schema: {
      tags: ['Tasks'],
      summary: 'Buscar tarefa por ID',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
      },
    },
  }, getById)

  fastify.post('/tasks', {
    preHandler: authenticate,
    schema: {
      tags: ['Tasks'],
      summary: 'Criar nova tarefa',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string', minLength: 1 },
          description: { type: 'string' },
          status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'DONE', 'CANCELLED'] },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
          dueDate: { type: 'string', format: 'date-time' },
          categoryId: { type: 'string' },
          assigneeId: { type: 'string' },
        },
      },
    },
  }, create)

  fastify.put('/tasks/:id', {
    preHandler: authenticate,
    schema: {
      tags: ['Tasks'],
      summary: 'Atualizar tarefa',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
      },
      body: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'DONE', 'CANCELLED'] },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
          dueDate: { type: 'string', format: 'date-time' },
          categoryId: { type: 'string' },
          assigneeId: { type: 'string' },
        },
      },
    },
  }, update)

  fastify.delete('/tasks/:id', {
    preHandler: authenticate,
    schema: {
      tags: ['Tasks'],
      summary: 'Deletar tarefa',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
      },
    },
  }, remove)

  fastify.post('/tasks/:id/collaborators', {
    preHandler: authenticate,
    schema: {
      tags: ['Tasks'],
      summary: 'Adicionar colaborador à tarefa',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
      },
      body: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string' },
        },
      },
    },
  }, addCollaborator)
}

module.exports = taskRoutes
