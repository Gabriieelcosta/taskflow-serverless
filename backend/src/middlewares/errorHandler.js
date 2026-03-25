const { AppError } = require('../utils/errors')

function translateValidationError(message) {
  if (!message) return 'Dados inválidos'

  if (message.includes('must NOT have fewer than')) {
    const match = message.match(/body\/(\w+).*fewer than (\d+)/)
    if (match) {
      const fieldMap = { name: 'Nome', email: 'E-mail', password: 'Senha', title: 'Título' }
      const field = fieldMap[match[1]] || match[1]
      return `${field} deve ter pelo menos ${match[2]} caracteres`
    }
  }
  if (message.includes('must match format "email"')) return 'E-mail inválido'
  if (message.includes("must have required property 'name'")) return 'Nome é obrigatório'
  if (message.includes("must have required property 'email'")) return 'E-mail é obrigatório'
  if (message.includes("must have required property 'password'")) return 'Senha é obrigatória'
  if (message.includes("must have required property 'title'")) return 'Título é obrigatório'

  return 'Dados inválidos. Verifique os campos e tente novamente'
}

async function errorHandler(error, request, reply) {
  // Erros que nós lançamos intencionalmente (AppError e subclasses)
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      error: error.name,
      message: error.message,
    })
  }

  // Erros de validação do Fastify (body/params inválidos)
  if (error.validation) {
    const translated = translateValidationError(error.message)
    return reply.status(400).send({
      statusCode: 400,
      error: 'Erro de validação',
      message: translated,
    })
  }

  // Erros do JWT (@fastify/jwt)
  if (error.statusCode === 401) {
    return reply.status(401).send({
      statusCode: 401,
      error: 'Unauthorized',
      message: 'Token inválido ou expirado',
    })
  }

  // Qualquer outro erro inesperado
  request.log.error(error)

  return reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'Ocorreu um erro interno no servidor',
  })
}

module.exports = { errorHandler }
