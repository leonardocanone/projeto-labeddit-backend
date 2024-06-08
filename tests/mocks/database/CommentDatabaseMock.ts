import { CommentDB, LikeDislikeDB, COMMENT_LIKE } from "../../../src/models/Comment";
import { BaseDatabase } from "../../../src/database/BaseDatabase";

const commentsMock: CommentDB[] = [
  {
    id: "id-mock-comment",
    post_id: "id-mock-post",
    creator_id: "id-mock-fulano",
    content: "Mock de comment",
    likes_count: 2,
    dislikes_count: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const commentsLikesMock: LikeDislikeDB[] = [
  {
    user_id: "id-mock-fulano",
    comment_id: "id-mock-comment",
    like: 3
  }
]

export class CommentDatabaseMock extends BaseDatabase {
  public static TABLE_COMMENTS = "comments"
  public static TABLE_LIKES_DISLIKES = "comments_likes_dislikes"

  public insertComment = async (commentDB: CommentDB): Promise<void> => {

  }

  public getPostComments = async (postId: string): Promise<CommentDB[]> => {
    return commentsMock
  }

  public findCommentById = async (id: string): Promise<CommentDB | undefined> => {
    return commentsMock.filter(comment => comment.id === id)[0]
  }

  public updateComment = async (commentDB: CommentDB): Promise<void> => {

  }

  public deleteCommentById = async (id: string): Promise<void> => {

  }

  public findLikeDislike =
    async (likeDislikeDB: LikeDislikeDB): Promise<COMMENT_LIKE | undefined > => {
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