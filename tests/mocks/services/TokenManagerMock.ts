import { TokenPayload, USER_ROLES } from '../../../src/models/User'

export class TokenManagerMock {
  public createToken = (payload: TokenPayload): string => {
    
    if (payload.id === "id-mock") {
      // signup de nova conta
      return "token-mock"

    } else if (payload.id === "id-mock-fulano") {
      // login do fulano (conta normal)
      return "token-mock-fulano"

    } else {
      // login do astrodev (conta admin)
      return "token-mock-astrodev"
    }
  }

  public getPayload = (token: string): TokenPayload | null => {
    if (token === "token-mock-fulano") {
      return {
        id: "id-mock-fulano",
        nickname: "Fulano",
        role: USER_ROLES.NORMAL
      }

    } else if (token === "token-mock-astrodev") {
        return {
          id: "id-mock-astrodev",
          nickname: "Astrodev",
          role: USER_ROLES.ADMIN
        }

    } else {
      return null
    }
  }
}