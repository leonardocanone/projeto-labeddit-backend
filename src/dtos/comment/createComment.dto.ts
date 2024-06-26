import z from "zod"

export interface CreateCommentInputDTO {
  token: string,
  postId: string,
  content: string
}

export interface CreateCommentOutputDTO {
    message: string,
    content: string
}

export const CreateCommentSchema = z.object({
  token: z.string().min(1),
  postId: z.string().min(1),
  content: z.string().min(1)
}).transform(data => data as CreateCommentInputDTO)