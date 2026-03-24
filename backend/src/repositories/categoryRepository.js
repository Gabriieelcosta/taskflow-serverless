const prisma = require('../config/database')

async function findAll(userId) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

async function findById(id) {
  return prisma.category.findUnique({ where: { id } })
}

async function create(data) {
  return prisma.category.create({ data })
}

async function update(id, data) {
  return prisma.category.update({ where: { id }, data })
}

async function remove(id) {
  return prisma.category.delete({ where: { id } })
}

module.exports = { findAll, findById, create, update, remove }
