const userService = require('../services/userService')

async function getProfile(request, reply) {
  const user = await userService.getProfile(request.user.id)
  return reply.send(user)
}

async function updateProfile(request, reply) {
  const user = await userService.updateProfile(request.user.id, request.body)
  return reply.send(user)
}

module.exports = { getProfile, updateProfile }
