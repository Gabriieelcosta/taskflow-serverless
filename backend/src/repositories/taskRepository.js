const prisma = require('../config/database')

async function findAll({ userId, status, priority, categoryId }) {
  return prisma.task.findMany({
    where: {
      OR: [
        { ownerId: userId },
        { assigneeId: userId },
        { collaborators: { some: { userId } } },
      ],
      ...(status && { status }),
      ...(priority && { priority }),
      ...(categoryId && { categoryId }),
    },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      assignee: { select: { id: true, name: true, email: true } },
      category: true,
      collaborators: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

async function findById(id) {
  return prisma.task.findUnique({
    where: { id },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      assignee: { select: { id: true, name: true, email: true } },
      category: true,
      collaborators: {
        include: { user: { select: { id: true, name: true, email: true } } },
      },
    },
  })
}

async function create(data) {
  return prisma.task.create({
    data,
    include: {
      owner: { select: { id: true, name: true, email: true } },
      category: true,
    },
  })
}

async function update(id, data) {
  return prisma.task.update({
    where: { id },
    data,
    include: {
      owner: { select: { id: true, name: true, email: true } },
      assignee: { select: { id: true, name: true, email: true } },
      category: true,
    },
  })
}

async function remove(id) {
  return prisma.task.delete({ where: { id } })
}

async function addCollaborator(taskId, userId) {
  return prisma.taskCollaborator.create({ data: { taskId, userId } })
}

async function removeCollaborator(taskId, userId) {
  return prisma.taskCollaborator.delete({
    where: { taskId_userId: { taskId, userId } },
  })
}

module.exports = { findAll, findById, create, update, remove, addCollaborator, removeCollaborator }
