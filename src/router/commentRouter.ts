import express from 'express'
import { CommentController } from '../controller/CommentController'
import { CommentBusiness } from '../business/CommentBusiness'
import { CommentDatabase } from '../database/CommentDatabase'
import { PostDatabase } from '../database/PostDatabase'
import { UserDatabase } from '../database/UserDatabase'
import { IdGenerator } from '../services/IdGenerator'
import { TokenManager } from '../services/TokenManager'

export const commentRouter = express.Router()

const commentController = new CommentController(
  new CommentBusiness(
    new CommentDatabase(),
    new PostDatabase(),
    new UserDatabase(),
    new IdGenerator(),
    new TokenManager()
  )
)

commentRouter.post("/:postId/comments", commentController.createComment)
commentRouter.get("/:postId/comments", commentController.getComments)
commentRouter.put("/comments/:id", commentController.editComment)
commentRouter.delete("/comments/:id", commentController.deleteComment)

commentRouter.put("/:postId/comments/:id/like", commentController.likeOrDislikeComment)

