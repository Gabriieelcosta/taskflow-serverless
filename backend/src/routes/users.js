const { getProfile, updateProfile } = require('../controllers/userController')
const { authenticate } = require('../middlewares/auth')

async function userRoutes(fastify) {
  fastify.get('/users/me', {
    preHandler: authenticate,
    schema: {
      tags: ['Users'],
      summary: 'Obter perfil do usuário autenticado',
      security: [{ bearerAuth: [] }],
    },
  }, getProfile)

  fastify.put('/users/me', {
    preHandler: authenticate,
    schema: {
      tags: ['Users'],
      summary: 'Atualizar perfil do usuário',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string', minLength: 2 },
          password: { type: 'string', minLength: 6 },
        },
      },
    },
  }, updateProfile)
}

module.exports = userRoutes
