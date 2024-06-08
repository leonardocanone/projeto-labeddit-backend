import { COMMENT_LIKE, CommentDB, LikeDislikeDB } from "../models/Comment"
import { BaseDatabase } from "./BaseDatabase"

export class CommentDatabase extends BaseDatabase {
    public static TABLE_COMMENTS = "comments"
    public static TABLE_LIKES_DISLIKES = "comments_likes_dislikes"
  
    public insertComment = async (commentDB: CommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .insert(commentDB)
    }

    public getPostComments = async (postId: string): Promise<CommentDB[]> => {
        return BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .where({ post_id: postId })
    }

    public findCommentById = async (id: string): Promise<CommentDB | undefined> => {
        const [commentDB]: CommentDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .select()
            .where({ id: id })

        return commentDB
    }

    public updateComment = async (commentDB: CommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .update(commentDB)
            .where({ id: commentDB.id })
    }

    public deleteCommentById = async (id: string): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .delete()
            .where({ id })
    }


    public findLikeDislike = async (
        likeDislikeDB: LikeDislikeDB
      ): Promise<COMMENT_LIKE | undefined> => {
    
        const [result]: Array<LikeDislikeDB | undefined> = await BaseDatabase
          .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
          .select()
          .where({
            user_id: likeDislikeDB.user_id,
            comment_id: likeDislikeDB.comment_id
          })
    
        if (result === undefined) {
          return undefined
    
        } else if (result.like === 1) {
          return COMMENT_LIKE.ALREADY_LIKED
          
        } else {
          return COMMENT_LIKE.ALREADY_DISLIKED
        }
      }
    
      public removeLikeDislike = async (
        likeDislikeDB: LikeDislikeDB
      ): Promise<void> => {
        await BaseDatabase
          .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
          .delete()
          .where({
            user_id: likeDislikeDB.user_id,
            comment_id: likeDislikeDB.comment_id
          })
      }
    
      public updateLikeDislike = async (
        likeDislikeDB: LikeDislikeDB
      ): Promise<void> => {
        await BaseDatabase
          .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
          .update(likeDislikeDB)
          .where({
            user_id: likeDislikeDB.user_id,
            comment_id: likeDislikeDB.comment_id
          })
      }
    
      public insertLikeDislike = async (
        likeDislikeDB: LikeDislikeDB
      ): Promise<void> => {
        await BaseDatabase
          .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
          .insert(likeDislikeDB)
      }

}