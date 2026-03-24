const { getAll, create, update, remove } = require('../controllers/categoryController')
const { authenticate } = require('../middlewares/auth')

async function categoryRoutes(fastify) {
  fastify.get('/categories', {
    preHandler: authenticate,
    schema: {
      tags: ['Categories'],
      summary: 'Listar categorias do usuário',
      security: [{ bearerAuth: [] }],
    },
  }, getAll)

  fastify.post('/categories', {
    preHandler: authenticate,
    schema: {
      tags: ['Categories'],
      summary: 'Criar nova categoria',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 1 },
          color: { type: 'string', default: '#6366f1' },
        },
      },
    },
  }, create)

  fastify.put('/categories/:id', {
    preHandler: authenticate,
    schema: {
      tags: ['Categories'],
      summary: 'Atualizar categoria',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
      },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          color: { type: 'string' },
        },
      },
    },
  }, update)

  fastify.delete('/categories/:id', {
    preHandler: authenticate,
    schema: {
      tags: ['Categories'],
      summary: 'Deletar categoria',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
      },
    },
  }, remove)
}

module.exports = categoryRoutes
