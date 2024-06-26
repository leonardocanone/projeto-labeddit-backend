import { PostBusiness } from "../../../src/business/PostBusiness"
import { IdGeneratorMock } from "../../mocks/services/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/services/TokenManagerMock"
import { UserDatabaseMock } from "../../mocks/database/UserDatabaseMock"
import { PostDatabaseMock } from "../../mocks/database/PostDatabaseMock"
import { PostModel } from "../../../src/models/Post"
import { GetPostByIdSchema } from "../../../src/dtos/post/getPostById.dto"

describe("Testando o getPostById", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  )

  test("deve retornar um post ao informarmos o id", async () => {
    const input = GetPostByIdSchema.parse({
      token: "token-mock-fulano",
      postId: "id-mock-post"
    })

    const output = await postBusiness.getPostById(input)

    const expectedPost: PostModel = {
      id: "id-mock-post",
      content: "Mock de post",
      likesCount: 3,
      dislikesCount: 2,
      commentsCount: 1,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      creator: {
        id: "id-mock-fulano",
        nickname: "Fulano"
      }
    }

    expect(output).toEqual(expectedPost)
  })
})