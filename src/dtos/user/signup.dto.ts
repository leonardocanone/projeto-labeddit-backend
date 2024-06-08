import z from 'zod'

export interface SignupInputDTO {
  nickname: string,
  email: string,
  password: string
}

export interface SignupOutputDTO {
  message: string,
  token: string
}

export const SignupSchema = z.object({
  nickname: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(4)
}).transform(data => data as SignupInputDTO)