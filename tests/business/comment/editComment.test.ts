import { CommentBusiness } from "../../../src/business/CommentBusiness"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { CommentDatabaseMock } from "../../mocks/database/CommentDatabaseMock"
import { UserDatabaseMock } from "../../mocks/database/UserDatabaseMock"
import { PostDatabaseMock } from "../../mocks/database/PostDatabaseMock"
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError"
import { EditCommentSchema } from "../../../src/dtos/comment/editComments.dto"

describe("Testando o editComment", () => {
  const commentBusiness = new CommentBusiness(
    new CommentDatabaseMock(),
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  )

  test("deve retornar uma mensagem de sucesso ao atualizar um comentário", async () => {
    const input = EditCommentSchema.parse({
      token: "token-mock-fulano",
      idToEdit: "id-mock-comment",
      content: "Testando a edição do comentário."
    })

    const output = await commentBusiness.editComment(input)

    expect(output).toEqual({
        message: "Comentário editado com sucesso.",  
        content: "Testando a edição do comentário."
      })
  })


  test("deve disparar erro se o token for inválido", async () => {
    expect.assertions(2)

    try {
      const input = EditCommentSchema.parse({
        token: "token invalido",
        idToEdit: "id-mock-comment",
        content: "Testando a edição do comentário."
      })

      const output = await commentBusiness.editComment(input)

    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401)
        expect(error.message).toBe("Token inválido")
      }
    }
  })
})