import { CommentBusiness } from "../../../src/business/CommentBusiness"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { CommentDatabaseMock } from "../../mocks/database/CommentDatabaseMock"
import { UserDatabaseMock } from "../../mocks/database/UserDatabaseMock"
import { PostDatabaseMock } from "../../mocks/database/PostDatabaseMock"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"
import { DeleteCommentSchema } from "../../../src/dtos/comment/deleteComment.dto"

describe("Testando o deleteComment", () => {
  const commentBusiness = new CommentBusiness(
    new CommentDatabaseMock(),
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  )

  test("deve retornar uma mensagem de sucesso ao deletar um comentário", async () => {
    const input = DeleteCommentSchema.parse({
      token: "token-mock-fulano",
      idToDelete: "id-mock-comment"
    })

    const output = await commentBusiness.deleteComment(input)

    expect(output).toEqual({
        message: "Comentário deletado com sucesso."
      })
  })


  test("deve disparar erro se o token for inválido", async () => {
    expect.assertions(2)

    try {
      const input = DeleteCommentSchema.parse({
        token: "token invalido",
        idToDelete: "id-mock-comment"
      })

      const output = await commentBusiness.deleteComment(input)

    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401)
        expect(error.message).toBe("Token inválido")
      }
    }
  })
})