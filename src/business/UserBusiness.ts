import { UserDatabase } from "../database/UserDatabase";
import { LoginInputDTO, LoginOutputDTO } from "../dtos/user/login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/user/signup.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { ConflictError } from "../errors/ConflictError";
import { TokenPayload, USER_ROLES, User } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) {}

  public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {

    const { nickname, email, password } = input

    const userExists = await this.userDatabase.findUserByEmail(email)

    if (userExists) {
      throw new ConflictError("Este email já está cadastrado. Utilize outro email.")
    }

    const id = this.idGenerator.generate()

    const hashedPassword = await this.hashManager.hash(password)

    const user = new User(
      id,
      nickname,
      email,
      hashedPassword,
      USER_ROLES.NORMAL,
      new Date().toISOString()
    )

    const userDB = user.toDBModel()
    await this.userDatabase.insertUser(userDB)

    const payload: TokenPayload = {
      id: user.getId(),
      nickname: user.getNickName(),
      role: user.getRole()
    }

    const token = this.tokenManager.createToken(payload)

    const output: SignupOutputDTO = {
      message: 'Usuário cadastrado com sucesso.',
      token
    }

    return output
  }


  public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
    
    const { email, password } = input

    const userDB = await this.userDatabase.findUserByEmail(email)

    if (!userDB) {
      throw new BadRequestError("E-mail e/ou senha inválido(s). Tente novamente!")
    }

    const user = new User(
      userDB.id,
      userDB.nickname,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at
    )

    const hashedPassword = user.getPassword()

    const isPasswordCorrect = await this.hashManager.compare(password, hashedPassword)

    if (!isPasswordCorrect) {
      throw new BadRequestError("E-mail e/ou senha inválido(s). Tente novamente!")
    }

    const payload: TokenPayload = {
      id: user.getId(),
      nickname: user.getNickName(),
      role: user.getRole()
    }

    const token = this.tokenManager.createToken(payload)

    const output: LoginOutputDTO = {
      message: 'Login realizado com sucesso.',
      token
    }

    return output
  }
}

