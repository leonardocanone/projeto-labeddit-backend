import { ZodError } from "zod"
import { UserBusiness } from "../../../src/business/UserBusiness"
import { SignupSchema } from "../../../src/dtos/user/signup.dto"
import { HashManagerMock } from "../../mocks/services/HashManagerMock"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/database/UserDatabaseMock"
import { ConflictError } from "../../../src/errors/ConflictError"

describe("Testando o signup", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  )

  test("deve gerar um token ao se cadastrar", async () => {
    const input = SignupSchema.parse({
      nickname: "User Test",
      email: "usertest@email.com",
      password: "usertest123"
    })

    const output = await userBusiness.signup(input)

    expect(output).toEqual({
      message: "Usuário cadastrado com sucesso.",  
      token: "token-mock"
    })    
  })

  test("deve disparar um erro caso e-mail já exista na base", async () => {
    expect.assertions(2)

    try {
      const input = SignupSchema.parse({
        nickname: "fulano",
        email: "fulano@email.com",
        password: "fulano123"
      })

      const output = await userBusiness.signup(input)

    } catch (error) {
      if (error instanceof ConflictError) {
        expect(error.statusCode).toBe(409)
        expect(error.message).toBe("Este email já está cadastrado.")
      }
    }
  })
})