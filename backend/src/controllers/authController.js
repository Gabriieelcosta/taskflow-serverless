const authService = require('../services/authService')

async function register(request, reply) {
  const { name, email, password } = request.body
  const result = await authService.register(request.server, { name, email, password })
  return reply.status(201).send(result)
}

async function login(request, reply) {
  const { email, password } = request.body
  const result = await authService.login(request.server, { email, password })
  return reply.send(result)
}

module.exports = { register, login }
