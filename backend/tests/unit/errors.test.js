const {
  AppError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
} = require('../../src/utils/errors')

describe('Classes de Erro HTTP', () => {
  describe('AppError', () => {
    it('deve criar um erro com mensagem e statusCode personalizados', () => {
      const erro = new AppError('Algo deu errado', 400)

      expect(erro.message).toBe('Algo deu errado')
      expect(erro.statusCode).toBe(400)
      expect(erro.name).toBe('AppError')
    })

    it('deve usar statusCode 400 como padrão', () => {
      const erro = new AppError('Erro genérico')

      expect(erro.statusCode).toBe(400)
    })

    it('deve ser uma instância de Error', () => {
      const erro = new AppError('Erro')

      expect(erro).toBeInstanceOf(Error)
    })
  })

  describe('NotFoundError', () => {
    it('deve ter statusCode 404', () => {
      const erro = new NotFoundError()

      expect(erro.statusCode).toBe(404)
      expect(erro.name).toBe('NotFoundError')
    })

    it('deve usar mensagem padrão quando não informada', () => {
      const erro = new NotFoundError()

      expect(erro.message).toBe('Recurso não encontrado')
    })

    it('deve aceitar mensagem personalizada', () => {
      const erro = new NotFoundError('Tarefa não encontrada')

      expect(erro.message).toBe('Tarefa não encontrada')
    })
  })

  describe('UnauthorizedError', () => {
    it('deve ter statusCode 401', () => {
      const erro = new UnauthorizedError()

      expect(erro.statusCode).toBe(401)
      expect(erro.name).toBe('UnauthorizedError')
    })

    it('deve usar mensagem padrão quando não informada', () => {
      const erro = new UnauthorizedError()

      expect(erro.message).toBe('Não autorizado')
    })
  })

  describe('ForbiddenError', () => {
    it('deve ter statusCode 403', () => {
      const erro = new ForbiddenError()

      expect(erro.statusCode).toBe(403)
      expect(erro.name).toBe('ForbiddenError')
    })

    it('deve usar mensagem padrão quando não informada', () => {
      const erro = new ForbiddenError()

      expect(erro.message).toBe('Acesso negado')
    })
  })
})
