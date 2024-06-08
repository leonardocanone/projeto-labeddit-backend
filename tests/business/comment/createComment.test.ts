import { CommentBusiness } from "../../../src/business/CommentBusiness"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { CommentDatabaseMock } from "../../mocks/database/CommentDatabaseMock"
import { UserDatabaseMock } from "../../mocks/database/UserDatabaseMock"
import { PostDatabaseMock } from "../../mocks/database/PostDatabaseMock"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"
import { CreateCommentSchema } from "../../../src/dtos/comment/createComment.dto"

describe("Testando o createComment", () => {
  const commentBusiness = new CommentBusiness(
    new CommentDatabaseMock(),
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  )

  test("deve retornar uma mensagem de sucesso ao criar um comentário", async () => {
    const input = CreateCommentSchema.parse({
      token: "token-mock-fulano",
      postId: "id-mock-post",
      content: "Comentário de teste."
    })

    const output = await commentBusiness.createComment(input)

    expect(output).toEqual({
        message: "Comentário criado com sucesso.",  
        content: "Comentário de teste."
      })
  })


  test("deve disparar erro se o token for inválido", async () => {
    expect.assertions(2)

    try {
      const input = CreateCommentSchema.parse({
        token: "token invalido",
        postId: "id-mock-post",
        content: "Comentário de teste"
      })

      const output = await commentBusiness.createComment(input)

    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401)
        expect(error.message).toBe("Token inválido")
      }
    }
  })
})