import z from "zod"

export interface DeleteCommentInputDTO {
  token: string,
  idToDelete: string
}

export interface DeleteCommentOutputDTO {
  message: string
}

export const DeleteCommentSchema = z.object({
  token: z.string().min(1),
  idToDelete: z.string().min(1)
}).transform(data => data as DeleteCommentInputDTO)