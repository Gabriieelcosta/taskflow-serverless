const sseService = require('../services/sseService')
const { authenticate } = require('../middlewares/auth')

async function eventRoutes(fastify) {
  fastify.get('/events', {
    preHandler: authenticate,
    schema: {
      tags: ['Events'],
      summary: 'Conectar ao stream de eventos em tempo real (SSE)',
      description: 'Mantém uma conexão aberta e recebe eventos quando tarefas são criadas, atualizadas ou deletadas.',
      security: [{ bearerAuth: [] }],
    },
  }, async (request, reply) => {
    const userId = request.user.id

    // Define os headers necessários para SSE
    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
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
