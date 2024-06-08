import { PostBusiness } from "../../../src/business/PostBusiness"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/database/UserDatabaseMock"
import { PostDatabaseMock } from "../../mocks/database/PostDatabaseMock"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"
import { EditPostSchema } from "../../../src/dtos/post/editPost.dto"

describe("Testando o editPost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  )

  test("deve retornar uma mensagem de sucesso ao atualizar um post", async () => {
    const input = EditPostSchema.parse({
      token: "token-mock-fulano",
      content: "Testando a edição do post.",
      idToEdit: "id-mock-post"
    })

    const output = await postBusiness.editPost(input)

    expect(output).toEqual({
        message: "Post editado com sucesso.",  
        content: "Testando a edição do post."
      })
  })


  test("deve disparar erro se o token for inválido", async () => {
    expect.assertions(2)

    try {
      const input = EditPostSchema.parse({
        token: "token inválido",
        content: "Testando a edição do post.",
        idToEdit: "id-mock-post"
      })

      const output = await postBusiness.editPost(input)

    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401)
        expect(error.message).toBe("Token inválido")
      }
    }
  })
})