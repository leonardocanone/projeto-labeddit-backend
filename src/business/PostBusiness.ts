import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/post/createPost.dto";
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dtos/post/deletePost.dto";
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/post/editPost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/post/getPosts.dto";
import { GetPostByIdInputDTO, GetPostByIdOutputDTO } from "../dtos/post/getPostById.dto";
import { LikeOrDislikePostInputDTO, LikeOrDislikePostOutputDTO } from "../dtos/post/likeOrDislikePost.dto";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { LikeDislikeDB, POST_LIKE, Post, PostModel } from "../models/Post";
import { USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {
  constructor(
    private postDatabase: PostDatabase,
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public createPost = async (input: CreatePostInputDTO): Promise<CreatePostOutputDTO> => {

    const { content, token } = input

    const payload = this.tokenManager.getPayload(token)

    if (!payload) {
      throw new UnauthorizedError()
    }

    const id = this.idGenerator.generate()

    const post = new Post(
      id,
      content,
      0,
      0,
      0,
      new Date().toISOString(),
      new Date().toISOString(),
      payload.id,
      payload.nickname
    )

    const postDB = post.toDBModel()
    await this.postDatabase.insertPost(postDB)

    const output: CreatePostOutputDTO = {
      message: 'Post criado com sucesso.',
      content
    }

    return output
  }


  public getPosts = async (input: GetPostsInputDTO): Promise<GetPostsOutputDTO> => {

    const { token } = input

    const payload = this.tokenManager.getPayload(token)

    if (!payload) {
      throw new UnauthorizedError()
    }

    const postsDBWithCreatorName = await this.postDatabase.getPostsWithCreatorName()

    const posts = postsDBWithCreatorName
      .map((postWithCreatorName) => {
        const post = new Post(
          postWithCreatorName.id,
          postWithCreatorName.content,
          postWithCreatorName.likes_count,
          postWithCreatorName.dislikes_count,
          postWithCreatorName.comments_count,
          postWithCreatorName.created_at,
          postWithCreatorName.updated_at,
          postWithCreatorName.creator_id,
          postWithCreatorName.creator_nickname
        )

        return post.toBusinessModel()
    })

    const output: GetPostsOutputDTO = posts

    return output
  }


  public getPostById = async (input: GetPostByIdInputDTO): Promise<GetPostByIdOutputDTO> => {

      const { token, postId } = input

      const payload = this.tokenManager.getPayload(token)
      
      if (!payload) {
        throw new UnauthorizedError()
      }

      const postDB = await this.postDatabase.findPostById(postId)

      if (!postDB) {
        throw new NotFoundError("Não existe um post com esse id.")
      }

      const userDB = await this.userDatabase.findUserById(postDB.creator_id)

      const post = new Post (
        postDB.id,
        postDB.content,
        postDB.likes_count,
        postDB.dislikes_count,
        postDB.comments_count,
        postDB.created_at,
        postDB.updated_at,
        postDB.creator_id,
        userDB.nickname
      )

      const output: GetPostByIdOutputDTO = post.toBusinessModel()
      
      return output
    }


  public editPost = async (input: EditPostInputDTO): Promise<EditPostOutputDTO> => {

    const { content, token, idToEdit } = input

    const payload = this.tokenManager.getPayload(token)

    if (!payload) {
      throw new UnauthorizedError()
    }

    const postDB = await this.postDatabase.findPostById(idToEdit)

    if (!postDB) {
      throw new NotFoundError("Não existe um post com esse id.")
    }

    if (payload.id !== postDB.creator_id) {
      throw new ForbiddenError("Somente quem criou o post poderá editá-lo.")
    }

    const post = new Post(
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

    post.setContent(content)

    const updatedPostDB = post.toDBModel()
    await this.postDatabase.updatePost(updatedPostDB)

    const output: EditPostOutputDTO = {
      message: 'Post editado com sucesso.',
      content
    }

    return output
  }


  public deletePost = async (input: DeletePostInputDTO): Promise<DeletePostOutputDTO> => {

    const { token, idToDelete } = input

    const payload = this.tokenManager.getPayload(token)

    if (!payload) {
      throw new UnauthorizedError()
    }

    const postDB = await this.postDatabase.findPostById(idToDelete)

    if (!postDB) {
      throw new NotFoundError("Não existe um post com esse id.")
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== postDB.creator_id) {
        throw new ForbiddenError("Somente quem criou o post poderá deletá-lo.")
      }
    }

    await this.postDatabase.deletePostById(idToDelete)

    const output: DeletePostOutputDTO = {
      message: 'Post deletado com sucesso.',
    }

    return output
  }


  public likeOrDislikePost = async (
    input: LikeOrDislikePostInputDTO
  ): Promise<LikeOrDislikePostOutputDTO> => {
    
    const { token, like, postId } = input

    const payload = this.tokenManager.getPayload(token)

    if (!payload) {
      throw new UnauthorizedError()
    }

    const postDBWithCreatorName =
      await this.postDatabase.findPostWithCreatorNameById(postId)

    if (!postDBWithCreatorName) {
      throw new NotFoundError("Não existe um post com esse id.")
    }

    const post = new Post(
      postDBWithCreatorName.id,
      postDBWithCreatorName.content,
      postDBWithCreatorName.likes_count,
      postDBWithCreatorName.dislikes_count,
      postDBWithCreatorName.comments_count,
      postDBWithCreatorName.created_at,
      postDBWithCreatorName.updated_at,
      postDBWithCreatorName.creator_id,
      postDBWithCreatorName.creator_nickname
    )

    const likeSQlite = like ? 1 : 0

    const likeDislikeDB: LikeDislikeDB = {
      user_id: payload.id,
      post_id: postId,
      like: likeSQlite
    }

    const likeDislikeExists =
      await this.postDatabase.findLikeDislike(likeDislikeDB)

    if (likeDislikeExists === POST_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.postDatabase.removeLikeDislike(likeDislikeDB)
        post.removeLike()
      } else {
        await this.postDatabase.updateLikeDislike(likeDislikeDB)
        post.removeLike()
        post.addDislike()
      }

    } else if (likeDislikeExists === POST_LIKE.ALREADY_DISLIKED) {
      if (like === false) {
        await this.postDatabase.removeLikeDislike(likeDislikeDB)
        post.removeDislike()
      } else {
        await this.postDatabase.updateLikeDislike(likeDislikeDB)
        post.removeDislike()
        post.addLike()
      }

    } else {
      await this.postDatabase.insertLikeDislike(likeDislikeDB)
      like ? post.addLike() : post.addDislike()
    }

    const updatedPostDB = post.toDBModel()
    await this.postDatabase.updatePost(updatedPostDB)

    const output: LikeOrDislikePostOutputDTO  = {
      message: 'O botão Like or Dislike foi acionado.',
    }

    return output
  }
}