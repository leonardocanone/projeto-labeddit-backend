import { CommentBusiness } from "../../../src/business/CommentBusiness"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { CommentDatabaseMock } from "../../mocks/database/CommentDatabaseMock"
import { UserDatabaseMock } from "../../mocks/database/UserDatabaseMock"
import { PostDatabaseMock } from "../../mocks/database/PostDatabaseMock"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"
import { LikeOrDislikeCommentSchema } from "../../../src/dtos/comment/likeOrDislikeComment.dto"

describe("Testando o likeOrDislikeComment", () => {
  const commentBusiness = new CommentBusiness(
    new CommentDatabaseMock(),
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  )

  test("deve retornar uma mensagem de sucesso ao dar like em um comentário", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      token: "token-mock-fulano",
      commentId: "id-mock-comment",
      like: true
    })

    const output = await commentBusiness.likeOrDislikeComment(input)

    expect(output).toEqual({
        message: "O botão Like or Dislike foi acionado."
      })
  })

  test("deve disparar erro se o token for inválido", async () => {
    expect.assertions(2)

    try {
      const input = LikeOrDislikeCommentSchema.parse({
        token: "token inválido",
        commentId: "id-mock-comment",
        like: true
      })

      const output = await commentBusiness.likeOrDislikeComment(input)

    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401)
        expect(error.message).toBe("Token inválido")
      }
    }
  })
})