import z from 'zod'

export interface LoginInputDTO {
  email: string,
  password: string
}

export interface LoginOutputDTO {
  message: string,
  token: string
}

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4, "A senha deve possuir no mínimo 4 caracteres.")
}).transform(data => data as LoginInputDTO)