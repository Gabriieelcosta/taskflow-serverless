const reportService = require('../services/reportService')

async function getSummary(request, reply) {
  const summary = await reportService.getSummary(request.user.id)
  return reply.send(summary)
}

module.exports = { getSummary }
