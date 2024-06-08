import z from 'zod'

export interface EditPostInputDTO {
  content: string,
  token: string,
  idToEdit: string
}

export interface EditPostOutputDTO {
  message: string,
  content: string
}

export const EditPostSchema = z.object({
  content: z.string().min(1),
  token: z.string().min(1),
  idToEdit: z.string().min(1)
}).transform(data => data as EditPostInputDTO)
