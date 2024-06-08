import { USER_ROLES, UserDB } from "../../../src/models/User";
import { BaseDatabase } from "../../../src/database/BaseDatabase";

const usersMock: UserDB[] = [
  {
    id: "id-mock-fulano",
    nickname: "Fulano",
    email: "fulano@email.com",
    password: "hash-mock-fulano",
    role: USER_ROLES.NORMAL,
    created_at: new Date().toISOString()
  },
  {
    id: "id-mock-astrodev",
    nickname: "Astrodev",
    email: "astrodev@email.com",
    password: "hash-mock-astrodev",
    role: USER_ROLES.ADMIN,
    created_at: new Date().toISOString()
  }
]

export class UserDatabaseMock extends BaseDatabase {
  public static TABLE_USERS = "users"

  public findUserByEmail = async (email: string): Promise<UserDB | undefined> => {
    return usersMock.filter(user => user.email === email)[0]
  }

  public findUserById = async (id: string): Promise<UserDB> => {
    return usersMock.filter(user => user.id === id)[0]
  }

  public insertUser = async (userDB: UserDB): Promise<void> => {

  }
}