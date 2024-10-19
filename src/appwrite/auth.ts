import {
  Client,
  Account,
  ID,
  AppwriteException,
  Models,
  OAuthProvider,
} from "appwrite"
import { AuthResponse, ErrorResponse, Session, User } from "./types"
import dbService from "./db"

class AuthService {
  client: Client
  account: Account

  constructor() {
    this.client = new Client()
    this.client
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "")
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT ?? "")

    this.account = new Account(this.client)
  }

  async getSession(): Promise<AuthResponse<User>> {
    try {
      const response = await this.account.get()
      return { success: true, message: "Success", payload: response }
    } catch (error) {
      return this.handleError(error)
    }
  }

  async signUpWithEmail(
    email: string,
    password: string,
  ): Promise<AuthResponse<User>> {
    try {
      const response = await this.account.create(ID.unique(), email, password)
      const user = await dbService.createUser(response.$id, email)
      return { success: true, message: "Success", payload: response }
    } catch (error) {
      return this.handleError(error)
    }
  }

  async loginWithEmail(
    email: string,
    password: string,
  ): Promise<AuthResponse<Session>> {
    try {
      const response = await this.account.createEmailPasswordSession(
        email,
        password,
      )
      return { success: true, message: "Success", payload: response }
    } catch (error) {
      return this.handleError(error)
    }
  }

  async OAuthLogin(provider: OAuthProvider): Promise<AuthResponse<void>> {
    try {
      await this.account.createOAuth2Session(
        provider,
        `${process.env.NEXT_PUBLIC_APP_URL}/projects`,
        process.env.NEXT_PUBLIC_APP_URL ?? "",
      )
      return { success: true, message: "Success", payload: undefined }
    } catch (error) {
      return this.handleError(error)
    }
  }

  async logout(): Promise<AuthResponse<void>> {
    try {
      await this.account.deleteSession("current")
      return { success: true, message: "Success", payload: undefined }
    } catch (error) {
      return this.handleError(error)
    }
  }

  private handleError(error: unknown): ErrorResponse {
    console.error(error)
    if (error instanceof AppwriteException) {
      return { success: false, message: error.message }
    }
    return { success: false, message: "An unexpected error occurred" }
  }
}

export default new AuthService()
