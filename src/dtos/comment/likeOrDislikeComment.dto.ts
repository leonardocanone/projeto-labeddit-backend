import z from "zod"

export interface LikeOrDislikeCommentInputDTO {
  token: string,
  commentId: string,
  like: boolean
}

export interface LikeOrDislikeCommentOutputDTO {
    message: string,
}

export const LikeOrDislikeCommentSchema = z.object({
  token: z.string().min(1),
  commentId: z.string().min(1),
  like: z.boolean()
}).transform(data => data as LikeOrDislikeCommentInputDTO)