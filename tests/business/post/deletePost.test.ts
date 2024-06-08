import { PostBusiness } from "../../../src/business/PostBusiness"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/database/UserDatabaseMock"
import { PostDatabaseMock } from "../../mocks/database/PostDatabaseMock"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"
import { DeletePostSchema } from "../../../src/dtos/post/deletePost.dto"

describe("Testando o deletePost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  )

  test("deve retornar uma mensagem de sucesso ao deletar um post", async () => {
    const input = DeletePostSchema.parse({
      token: "token-mock-fulano",
      idToDelete: "id-mock-post"
    })

    const output = await postBusiness.deletePost(input)

    expect(output).toEqual({
        message: "Post deletado com sucesso."  
      })
  })


  test("deve disparar erro se o token for inválido", async () => {
    expect.assertions(2)

    try {
      const input = DeletePostSchema.parse({
        token: "token inválido",
        idToDelete: "id-mock-post"
      })

      const output = await postBusiness.deletePost(input)

    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401)
        expect(error.message).toBe("Token inválido")
      }
    }
  })
})