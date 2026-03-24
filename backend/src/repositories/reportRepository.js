const prisma = require('../config/database')

async function getSummary(userId) {
  const [totalTasks, byStatus, byPriority, byCategory, overdue] = await Promise.all([
    // Total de tarefas do usuário
    prisma.task.count({
      where: { OR: [{ ownerId: userId }, { assigneeId: userId }] },
    }),

    // Agrupado por status
    prisma.task.groupBy({
      by: ['status'],
      where: { OR: [{ ownerId: userId }, { assigneeId: userId }] },
      _count: { status: true },
    }),

    // Agrupado por prioridade
    prisma.task.groupBy({
      by: ['priority'],
      where: { OR: [{ ownerId: userId }, { assigneeId: userId }] },
      _count: { priority: true },
    }),

    // Tarefas por categoria
    prisma.task.groupBy({
      by: ['categoryId'],
      where: {
        OR: [{ ownerId: userId }, { assigneeId: userId }],
        categoryId: { not: null },
      },
      _count: { categoryId: true },
    }),

    // Tarefas atrasadas (com data de entrega no passado e não concluídas)
    prisma.task.count({
      where: {
        OR: [{ ownerId: userId }, { assigneeId: userId }],
        dueDate: { lt: new Date() },
        status: { notIn: ['DONE', 'CANCELLED'] },
      },
    }),
  ])

  return { totalTasks, byStatus, byPriority, byCategory, overdue }
}

module.exports = { getSummary }
