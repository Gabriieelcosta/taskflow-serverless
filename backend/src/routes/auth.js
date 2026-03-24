const { register, login } = require('../controllers/authController')

async function authRoutes(fastify) {
  fastify.post('/auth/register', {
    schema: {
      tags: ['Auth'],
      summary: 'Cadastrar novo usuário',
      body: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 2 },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                email: { type: 'string' },
              },
            },
          },
        },
      },
    },
  }, register)

  fastify.post('/auth/login', {
    schema: {
      tags: ['Auth'],
      summary: 'Realizar login',
      body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
    },
  }, login)
}

module.exports = authRoutes
