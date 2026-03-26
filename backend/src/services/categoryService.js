const categoryRepository = require('../repositories/categoryRepository')
const sseService = require('./sseService')
const { NotFoundError, ForbiddenError } = require('../utils/errors')

async function getAll() {
  return categoryRepository.findAll()
}

async function create(userId, { name, color }) {
  const category = await categoryRepository.create({ name, color, userId })
  sseService.broadcast('category:created', category, userId)
  return category
}

async function update(userId, categoryId, data) {
  const category = await categoryRepository.findById(categoryId)
  if (!category) throw new NotFoundError('Categoria não encontrada')
  if (category.userId !== userId) throw new ForbiddenError('Acesso negado')

  const updated = await categoryRepository.update(categoryId, data)
  sseService.broadcast('category:updated', updated, userId)
  return updated
}

async function remove(userId, categoryId) {
  const category = await categoryRepository.findById(categoryId)
  if (!category) throw new NotFoundError('Categoria não encontrada')
  if (category.userId !== userId) throw new ForbiddenError('Acesso negado')

  await categoryRepository.remove(categoryId)
  sseService.broadcast('category:deleted', { id: categoryId }, userId)
}

module.exports = { getAll, create, update, remove }
