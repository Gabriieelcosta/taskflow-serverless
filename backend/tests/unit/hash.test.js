const { hashPassword, comparePassword } = require('../../src/utils/hash')

describe('Utilitários de Hash de Senha', () => {
  describe('hashPassword', () => {
    it('deve retornar uma string diferente da senha original', async () => {
      const senha = 'minhasenha123'
      const hash = await hashPassword(senha)

      expect(hash).not.toBe(senha)
      expect(typeof hash).toBe('string')
    })

    it('deve gerar hashes diferentes para a mesma senha (salt aleatório)', async () => {
      const senha = 'minhasenha123'
      const hash1 = await hashPassword(senha)
      const hash2 = await hashPassword(senha)

      // Dois hashes da mesma senha devem ser diferentes por causa do salt
      expect(hash1).not.toBe(hash2)
    })

    it('deve gerar um hash no formato bcrypt ($2a$ ou $2b$)', async () => {
      const hash = await hashPassword('qualquersenha')

      expect(hash).toMatch(/^\$2[ab]\$/)
    })
  })

  describe('comparePassword', () => {
    it('deve retornar true quando a senha corresponde ao hash', async () => {
      const senha = 'minhasenha123'
      const hash = await hashPassword(senha)
      const resultado = await comparePassword(senha, hash)

      expect(resultado).toBe(true)
    })

    it('deve retornar false quando a senha não corresponde ao hash', async () => {
      const hash = await hashPassword('senhaoriginal')
      const resultado = await comparePassword('senhaerrada', hash)

      expect(resultado).toBe(false)
    })

    it('deve retornar false para senha vazia', async () => {
      const hash = await hashPassword('senhaoriginal')
      const resultado = await comparePassword('', hash)

      expect(resultado).toBe(false)
    })
  })
})
