const { getSummary } = require('../controllers/reportController')
const { authenticate } = require('../middlewares/auth')

async function reportRoutes(fastify) {
  fastify.get('/reports/summary', {
    preHandler: authenticate,
    schema: {
      tags: ['Reports'],
      summary: 'Resumo de tarefas por status, prioridade e categoria',
      security: [{ bearerAuth: [] }],
    },
  }, getSummary)
}

module.exports = reportRoutes
