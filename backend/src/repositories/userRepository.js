const prisma = require('../config/database')

async function findByEmail(email) {
  return prisma.user.findUnique({ where: { email } })
}

async function findById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, createdAt: true },
  })
}

async function create(data) {
  return prisma.user.create({
    data,
    select: { id: true, name: true, email: true, createdAt: true },
  })
}

async function update(id, data) {
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, createdAt: true },
  })
}

module.exports = { findByEmail, findById, create, update }
