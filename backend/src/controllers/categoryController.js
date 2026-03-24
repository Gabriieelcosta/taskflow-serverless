const categoryService = require('../services/categoryService')

async function getAll(request, reply) {
  const categories = await categoryService.getAll(request.user.id)
  return reply.send(categories)
}

async function create(request, reply) {
  const category = await categoryService.create(request.user.id, request.body)
  return reply.status(201).send(category)
}

async function update(request, reply) {
  const category = await categoryService.update(request.user.id, request.params.id, request.body)
  return reply.send(category)
}

async function remove(request, reply) {
  await categoryService.remove(request.user.id, request.params.id)
  return reply.status(204).send()
}

module.exports = { getAll, create, update, remove }
