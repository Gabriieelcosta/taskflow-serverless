const taskRepository = require('../repositories/taskRepository')
const { NotFoundError, ForbiddenError } = require('../utils/errors')
const sseService = require('./sseService')

async function getAll(userId, filters) {
  return taskRepository.findAll({ userId, ...filters })
}

async function getById(userId, taskId) {
  const task = await taskRepository.findById(taskId)
  if (!task) throw new NotFoundError('Tarefa não encontrada')

  const isMember =
    task.ownerId === userId ||
    task.assigneeId === userId ||
    task.collaborators.some((c) => c.userId === userId)

  if (!isMember) throw new ForbiddenError('Acesso negado')

  return task
}

async function create(userId, data) {
  const cleanData = {
    ...data,
    description: data.description || null,
    dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
  }
  const task = await taskRepository.create({ ...cleanData, ownerId: userId })

  // Transmite evento SSE para todos os usuários conectados
  sseService.broadcast('task:created', task, userId)

  return task
}

async function update(userId, taskId, data) {
  const task = await taskRepository.findById(taskId)
  if (!task) throw new NotFoundError('Tarefa não encontrada')
  if (task.ownerId !== userId) throw new ForbiddenError('Apenas o dono pode editar a tarefa')

  const cleanData = {
    ...data,
    dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
  }
  const updated = await taskRepository.update(taskId, cleanData)

  // Transmite evento SSE para colaboradores e responsável
  sseService.broadcast('task:updated', updated, userId)

  return updated
}

async function remove(userId, taskId) {
  const task = await taskRepository.findById(taskId)
  if (!task) throw new NotFoundError('Tarefa não encontrada')
  if (task.ownerId !== userId) throw new ForbiddenError('Apenas o dono pode excluir a tarefa')

  await taskRepository.remove(taskId)

  // Transmite evento SSE informando a exclusão
  sseService.broadcast('task:deleted', { id: taskId }, userId)
}

async function addCollaborator(userId, taskId, collaboratorId) {
  const task = await taskRepository.findById(taskId)
  if (!task) throw new NotFoundError('Tarefa não encontrada')
  if (task.ownerId !== userId) throw new ForbiddenError('Apenas o dono pode adicionar colaboradores')

  await taskRepository.addCollaborator(taskId, collaboratorId)

  // Notifica o colaborador adicionado via SSE
  sseService.sendToUser(collaboratorId, 'task:collaborator_added', {
    taskId,
    taskTitle: task.title,
    message: 'Você foi adicionado como colaborador em uma tarefa',
  })

  return taskRepository.findById(taskId)
}

module.exports = { getAll, getById, create, update, remove, addCollaborator }
