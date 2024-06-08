import { PostBusiness } from "../../../src/business/PostBusiness"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/database/UserDatabaseMock"
import { PostDatabaseMock } from "../../mocks/database/PostDatabaseMock"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"
import { LikeOrDislikePostSchema } from "../../../src/dtos/post/likeOrDislikePost.dto"

describe("Testando o likeOrDislikePost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  )

  test("deve retornar uma mensagem de sucesso ao dar like em um post", async () => {
    const input = LikeOrDislikePostSchema.parse({
      token: "token-mock-fulano",
      postId: "id-mock-post",
      like: true
    })

    const output = await postBusiness.likeOrDislikePost(input)

    expect(output).toEqual({
        message: "O botão Like or Dislike foi acionado."
      })
  })

  test("deve disparar erro se o token for inválido", async () => {
    expect.assertions(2)

    try {
      const input = LikeOrDislikePostSchema.parse({
        token: "token inválido",
        postId: "id-mock-post",
        like: true
      })

      const output = await postBusiness.likeOrDislikePost(input)

    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401)
        expect(error.message).toBe("Token inválido")
      }
    }
  })
})