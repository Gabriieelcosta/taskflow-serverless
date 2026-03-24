const taskService = require('../services/taskService')

async function getAll(request, reply) {
  const tasks = await taskService.getAll(request.user.id, request.query)
  return reply.send(tasks)
}

async function getById(request, reply) {
  const task = await taskService.getById(request.user.id, request.params.id)
  return reply.send(task)
}

async function create(request, reply) {
  const task = await taskService.create(request.user.id, request.body)
  return reply.status(201).send(task)
}

async function update(request, reply) {
  const task = await taskService.update(request.user.id, request.params.id, request.body)
  return reply.send(task)
}

async function remove(request, reply) {
  await taskService.remove(request.user.id, request.params.id)
  return reply.status(204).send()
}

async function addCollaborator(request, reply) {
  const task = await taskService.addCollaborator(
    request.user.id,
    request.params.id,
    request.body.userId
  )
  return reply.status(201).send(task)
}

module.exports = { getAll, getById, create, update, remove, addCollaborator }
