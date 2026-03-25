const sseService = require('../services/sseService')
const { UnauthorizedError } = require('../utils/errors')

async function eventRoutes(fastify) {
  // EventSource do browser não suporta headers customizados,
  // então o token vem na query string ao invés do header Authorization
  async function authenticateSSE(request) {
    try {
      const token = request.query.token
      if (!token) throw new Error('Token ausente')
      request.user = fastify.jwt.verify(token)
    } catch {
      throw new UnauthorizedError('Token inválido ou expirado')
    }
  }

  fastify.get('/events', {
    preHandler: authenticateSSE,
    schema: {
      tags: ['Events'],
      summary: 'Conectar ao stream de eventos em tempo real (SSE)',
      description: 'Mantém uma conexão aberta e recebe eventos quando tarefas são criadas, atualizadas ou deletadas.',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const userId = request.user.id

    // Define os headers necessários para SSE
    // CORS precisa ser adicionado manualmente pois reply.raw.writeHead bypassa o middleware
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*',
    })

    // Registra o cliente como conectado
    sseService.addClient(userId, reply)

    // Envia um evento inicial confirmando a conexão
    reply.raw.write(`event: connected\n`)
    reply.raw.write(`data: ${JSON.stringify({ message: 'Conectado ao stream de eventos' })}\n\n`)

    // Remove o cliente quando a conexão for encerrada
    request.raw.on('close', () => {
      sseService.removeClient(userId)
    })

    // Mantém a conexão aberta — nunca chama reply.send()
    await new Promise(() => {})
  })
}

module.exports = eventRoutes
