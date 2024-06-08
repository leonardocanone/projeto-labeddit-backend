import { CommentDatabase } from "../database/CommentDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { UserDatabase } from "../database/UserDatabase"
import { CreateCommentInputDTO, CreateCommentOutputDTO } from "../dtos/comment/createComment.dto"
import { DeleteCommentInputDTO, DeleteCommentOutputDTO } from "../dtos/comment/deleteComment.dto"
import { EditCommentInputDTO, EditCommentOutputDTO } from "../dtos/comment/editComments.dto"
import { GetCommentsInputDTO, GetCommentsOutputDTO } from "../dtos/comment/getComments.dto"
import { LikeOrDislikeCommentInputDTO, LikeOrDislikeCommentOutputDTO } from "../dtos/comment/likeOrDislikeComment.dto"
import { ForbiddenError } from "../errors/ForbiddenError"
import { NotFoundError } from "../errors/NotFoundError"
import { UnauthorizedError } from "../errors/UnauthorizedError"
import { COMMENT_LIKE, Comment, CommentModel, LikeDislikeDB } from "../models/Comment"
import { Post } from "../models/Post"
import { USER_ROLES } from "../models/User"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export class CommentBusiness {
    constructor(
      private commentDatabase: CommentDatabase,
      private postDatabase: PostDatabase,
      private userDatabase: UserDatabase,
      private idGenerator: IdGenerator,
      private tokenManager: TokenManager
    ) {}
  
    public createComment = 
      async (input: CreateCommentInputDTO): Promise<CreateCommentOutputDTO> => {
    
        const { token, postId, content } = input
  
        const payload = this.tokenManager.getPayload(token)
        
        if (!payload) {
          throw new UnauthorizedError()
        }
  
        const postDB = await this.postDatabase.findPostById(postId)
  
        if (!postDB) {
          throw new NotFoundError("Não existe um post com esse id.")
        }
  
        const id = this.idGenerator.generate()
  
        const comment = new Comment(
          id,
          postId,
          content,
          0,
          0,
          new Date().toISOString(),
          new Date().toISOString(),
          payload.id,
          payload.nickname
        )
  
        await this.commentDatabase.insertComment(comment.toDBModel())
  
        const creatorDB = await this.userDatabase.findUserById(postDB.creator_id)
  
        const post = new Post (
          postDB.id,
          postDB.content,
          postDB.likes_count,
          postDB.dislikes_count,
          postDB.comments_count,
          postDB.created_at,
          postDB.updated_at,
          postDB.creator_id,
          creatorDB.nickname
        )
  
        post.increaseCommentsCount()
        await this.postDatabase.updatePost(post.toDBModel())
  
        const output: CreateCommentOutputDTO = {
            message: 'Comentário criado com sucesso.',
            content
          }

        return output
    }


    public getComments = 
      async (input: GetCommentsInputDTO): Promise<GetCommentsOutputDTO> => {
  
      const { token, postId } = input

      const payload = this.tokenManager.getPayload(token)
      
      if (!payload) {
        throw new UnauthorizedError()
      }

      const postDB = await this.postDatabase.findPostById(postId)

      if (!postDB) {
        throw new NotFoundError("Não existe um post com esse id.")
      }

      const commentsDB = await this.commentDatabase.getPostComments(postId)

      const commentsModel: CommentModel[] = []

      for (let commentDB of commentsDB) {
        
        const userDB = await this.userDatabase.findUserById(commentDB.creator_id)

        const comment = new Comment(
          commentDB.id,
          commentDB.post_id,
          commentDB.content,
          commentDB.likes_count,
          commentDB.dislikes_count,
          commentDB.created_at,
          commentDB.updated_at,
          commentDB.creator_id,
          userDB.nickname
        )

        commentsModel.push(comment.toBusinessModel())
      }

      const output: GetCommentsOutputDTO = commentsModel
      
      return output
  }


  public editComment = async (input: EditCommentInputDTO): Promise<EditCommentOutputDTO> => {

    const { content, token, idToEdit } = input

    const payload = this.tokenManager.getPayload(token)

    if (!payload) {
      throw new UnauthorizedError()
    }

    const commentDB = await this.commentDatabase.findCommentById(idToEdit)

    if (!commentDB) {
      throw new NotFoundError("Não existe um comentário com esse id.")
    }

    if (payload.id !== commentDB.creator_id) {
      throw new ForbiddenError("Somente quem criou o comentário poderá editá-lo.")
    }

    const comment = new Comment (
      commentDB.id,
      commentDB.post_id,
      commentDB.content,
      commentDB.likes_count,
      commentDB.dislikes_count,
      commentDB.created_at,
      commentDB.updated_at,
      commentDB.creator_id,
      payload.nickname
    )

    comment.setContent(content)

    const updatedCommentDB = comment.toDBModel()
    await this.commentDatabase.updateComment(updatedCommentDB)

    const output: EditCommentOutputDTO = {
      message: 'Comentário editado com sucesso.',
      content
    }

    return output
  }


  public deleteComment = async (input: DeleteCommentInputDTO): Promise<DeleteCommentOutputDTO> => {

    const { token, idToDelete } = input

    const payload = this.tokenManager.getPayload(token)

    if (!payload) {
      throw new UnauthorizedError()
    }

    const commentDB = await this.commentDatabase.findCommentById(idToDelete)

    if (!commentDB) {
      throw new NotFoundError("Não existe um comentário com esse id.")
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== commentDB.creator_id) {
        throw new ForbiddenError("Somente quem criou o comentário poderá deletá-lo.")
      }
    }

    await this.commentDatabase.deleteCommentById(idToDelete)

    
    const postDB = await this.postDatabase.findPostById(commentDB.post_id);

    if (!postDB) {
        throw new NotFoundError("Não foi possível encontrar o post associado ao comentário.");
    }

    const post = new Post (
        postDB.id,
        postDB.content,
        postDB.likes_count,
        postDB.dislikes_count,
        postDB.comments_count,
        postDB.created_at,
        postDB.updated_at,
        postDB.creator_id,
        payload.nickname
    )

    post.decreaseCommentsCount();
    await this.postDatabase.updatePost(post.toDBModel());

    const output: DeleteCommentOutputDTO = {
      message: 'Comentário deletado com sucesso.',
    }

    return output
  }


  public likeOrDislikeComment = async (
    input: LikeOrDislikeCommentInputDTO
  ): Promise<LikeOrDislikeCommentOutputDTO> => {
    
    const { token, commentId, like } = input

    const payload = this.tokenManager.getPayload(token)

    if (!payload) {
      throw new UnauthorizedError()
    }

    const commentDB = await this.commentDatabase.findCommentById(commentId)

    if (!commentDB) {
      throw new NotFoundError("Não existe um comentário com esse id.")
    }

    const comment = new Comment (
      commentDB.id,
      commentDB.post_id,
      commentDB.content,
      commentDB.likes_count,
      commentDB.dislikes_count,
      commentDB.created_at,
      commentDB.updated_at,
      commentDB.creator_id,
      payload.nickname
    )

    const likeSQlite = like ? 1 : 0

    const likeDislikeDB: LikeDislikeDB = {
      user_id: payload.id,
      comment_id: commentId,
      like: likeSQlite
    }

    const likeDislikeExists =
      await this.commentDatabase.findLikeDislike(likeDislikeDB)

    if (likeDislikeExists === COMMENT_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.commentDatabase.removeLikeDislike(likeDislikeDB)
        comment.removeLike()
      } else {
        await this.commentDatabase.updateLikeDislike(likeDislikeDB)
        comment.removeLike()
        comment.addDislike()
      }

    } else if (likeDislikeExists === COMMENT_LIKE.ALREADY_DISLIKED) {
      if (like === false) {
        await this.commentDatabase.removeLikeDislike(likeDislikeDB)
        comment.removeDislike()
      } else {
        await this.commentDatabase.updateLikeDislike(likeDislikeDB)
        comment.removeDislike()
        comment.addLike()
      }

    } else {
      await this.commentDatabase.insertLikeDislike(likeDislikeDB)
      like ? comment.addLike() : comment.addDislike()
    }

    const updatedCommentDB = comment.toDBModel()
    await this.commentDatabase.updateComment(updatedCommentDB)

    const output: LikeOrDislikeCommentOutputDTO  = {
      message: 'O botão Like or Dislike foi acionado.',
    }

    return output
  }

}