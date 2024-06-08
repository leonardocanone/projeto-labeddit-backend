import { PostDB, LikeDislikeDB, PostsDBWithCreatorName, POST_LIKE } from "../../../src/models/Post";
import { BaseDatabase } from "../../../src/database/BaseDatabase";

const postsMock: PostDB[] = [
  {
    id: "id-mock-post",
    creator_id: "id-mock-fulano",
    content: "Mock de post",
    likes_count: 3,
    dislikes_count: 2,
    comments_count: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const postsMock2: PostsDBWithCreatorName[] = [
    {
      id: "id-mock-post",
      creator_id: "id-mock-fulano",
      content: "Mock de post",
      likes_count: 3,
      dislikes_count: 2,
      comments_count: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      creator_nickname: "Fulano"
    }
  ]

  const postsMock3: PostsDBWithCreatorName = 
    {
      id: "id-mock-post",
      creator_id: "id-mock-fulano",
      content: "Mock de post",
      likes_count: 3,
      dislikes_count: 2,
      comments_count: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      creator_nickname: "Fulano"
    }

const postsLikesMock: LikeDislikeDB[] = [
  {
    user_id: "id-mock-fulano",
    post_id: "id-mock-post",
    like: 1
  }
]

export class PostDatabaseMock extends BaseDatabase {
  public static TABLE_POSTS = "posts"
  public static TABLE_LIKES_DISLIKES = "posts_likes_dislikes"

  public insertPost = async (postDB: PostDB): Promise<void> => {

  }

  public getPostsWithCreatorName = async (): Promise<PostsDBWithCreatorName[]> => {
    return postsMock2
  }

  public findPostById = async (id: string): Promise<PostDB | undefined> => {
    return postsMock.filter(post => post.id === id)[0]
  }

  public updatePost = async (postDB: PostDB): Promise<void> => {

  }

  public deletePostById = async (id: string): Promise<void> => {

  }

  public findPostWithCreatorNameById =
    async (id: string): Promise<PostsDBWithCreatorName | undefined> => {
    return postsMock3
  }

  public findLikeDislike =
    async (likeDislikeDB: LikeDislikeDB): Promise<POST_LIKE | undefined > => {
      return 
    }

  public removeLikeDislike
    = async (likeDislikeDB: LikeDislikeDB): Promise<void> => {

    }

  public updateLikeDislike
    = async (likeDislikeDB: LikeDislikeDB): Promise<void> => {

    }

  public insertLikeDislike
    = async (likeDislikeDB: LikeDislikeDB): Promise<void> => {

    }
}