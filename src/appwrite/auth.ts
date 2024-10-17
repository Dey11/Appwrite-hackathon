import { Client, Account, OAuthProvider, ID } from "appwrite"

export class AuthService {
  client
  account

  constructor() {
    this.client = new Client()
    this.client
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "")
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT || "")

    this.account = new Account(this.client)
  }

  async getSession() {
    try {
      const response = await this.account.get()
      return response
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async signUpWithEmail(email: string, password: string) {
    try {
      const response = await this.account.create(ID.unique(), email, password)
      return response
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async loginWithEmail(email: string, password: string) {
    try {
      const response = await this.account.createEmailPasswordSession(
        email,
        password,
      )
      console.log(response,"res")

      return response
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async OAuthLogin(provider: OAuthProvider) {
    try {
      const response = await this.account.createOAuth2Session(
        provider,
        `${process.env.NEXT_PUBLIC_APP_URL}`,
        `${process.env.NEXT_PUBLIC_APP_URL}`,
      )
      return response
    } catch (error) {
      console.error(error)
      return null
    }
  }

  async logout() {
    try {
      const response = await this.account.deleteSession("current")
      return response
    } catch (error) {
      console.error(error)
      return null
    }
  }
}

const auth = new AuthService()

export default auth
