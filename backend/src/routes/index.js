const authRoutes = require('./auth')
const userRoutes = require('./users')
const taskRoutes = require('./tasks')
const categoryRoutes = require('./categories')
const reportRoutes = require('./reports')
const eventRoutes = require('./events')

async function registerRoutes(fastify) {
  fastify.register(authRoutes)
  fastify.register(userRoutes)
  fastify.register(taskRoutes)
  fastify.register(categoryRoutes)
  fastify.register(reportRoutes)
  fastify.register(eventRoutes)
}

module.exports = registerRoutes
