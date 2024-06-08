import { UserBusiness } from "../../../src/business/UserBusiness"
import { LoginSchema } from "../../../src/dtos/user/login.dto"
import { HashManagerMock } from "../../mocks/services/HashManagerMock"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/database/UserDatabaseMock"

describe("Testando o login", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  )

  test("deve retornar um token de conta normal ao logar", async () => {
    const input = LoginSchema.parse ({
      email: "fulano@email.com",
      password: "fulano123"
    })

    const output = await userBusiness.login(input)

    expect(output).toEqual({
      message: "Login realizado com sucesso.",
      token: "token-mock-fulano"
    })
  })

  test("deve retornar um token de conta admin ao logar", async () => {
    const input = LoginSchema.parse ({
      email: "astrodev@email.com",
      password: "astrodev99"
    })

    const output = await userBusiness.login(input)

    expect(output).toEqual({
      message: "Login realizado com sucesso.",
      token: "token-mock-astrodev"
    })
  })
})