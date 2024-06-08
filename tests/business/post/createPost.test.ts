import { PostBusiness } from "../../../src/business/PostBusiness"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/database/UserDatabaseMock"
import { PostDatabaseMock } from "../../mocks/database/PostDatabaseMock"
import { CreatePostSchema } from "../../../src/dtos/post/createPost.dto"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"

describe("Testando o createPost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  )

  test("deve retornar uma mensagem de sucesso ao criar um post", async () => {
    const input = CreatePostSchema.parse({
      token: "token-mock-fulano",
      content: "Postagem de teste."
    })

    const output = await postBusiness.createPost(input)

    expect(output).toEqual({
        message: "Post criado com sucesso.",  
        content: "Postagem de teste."
      })
  })


  test("deve disparar erro se o token for inválido", async () => {
    expect.assertions(2)

    try {
      const input = CreatePostSchema.parse({
        token: "token inválido",
        content: "Postagem de teste"
      })

      const output = await postBusiness.createPost(input)

    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401)
        expect(error.message).toBe("Token inválido")
      }
    }
  })
})