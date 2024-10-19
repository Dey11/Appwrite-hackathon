import { Databases, Client, ID, AppwriteException, Query } from "appwrite"
import {
  Collection,
  DbResponse,
  ErrorResponse,
  FeedbackDocument,
  ProjectDocument,
  UserDocument,
} from "./types"
import authService from "./auth"

const collectionId = {
  project: "6711fa430021998ea7ca",
  feedback: "6711fa080018a94a875c",
  user: "6711f9f90001ee20d5e1",
}

class DatabaseService {
  client: Client
  databases: Databases

  constructor() {
    this.client = new Client()
    this.client
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "")
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT ?? "")

    this.databases = new Databases(this.client)
  }

  // create user
  async createUser(
    accountId: string,
    email: string,
    name?: string,
  ): Promise<DbResponse<UserDocument>> {
    try {
      const response: UserDocument = await this.databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID ?? "",
        collectionId.user,
        ID.unique(),
        { email, name, accountId },
      )

      return { success: true, message: "Success", payload: response }
    } catch (error) {
      return this.handleError(error)
    }
  }

  // get user by document id
  async getUserById(userId: string): Promise<DbResponse<UserDocument>> {
    try {
      const response: UserDocument = await this.databases.getDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID ?? "",
        collectionId.user,
        userId,
      )
      return { success: true, message: "Success", payload: response }
    } catch (error) {
      return this.handleError(error)
    }
  }

  // get user by account id
  async getUserByAccountId(
    accountId: string,
  ): Promise<DbResponse<UserDocument>> {
    try {
      const response = await this.databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID ?? "",
        collectionId.user,
        [Query.equal("accountId", accountId)],
      )
      if (response.total === 0) {
        throw new Error("User not found")
      }
      return {
        success: true,
        message: "Success",
        payload: response.documents[0] as UserDocument,
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  // get doc of current user
  async getCurrentUser(): Promise<DbResponse<UserDocument>> {
    try {
      const currentUser = await authService.getSession()
      if (!currentUser.success) {
        throw new Error(currentUser.message)
      }

      const response = await this.databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID ?? "",
        collectionId.user,
        [Query.equal("accountId", currentUser.payload.$id)],
      )
      if (response.total === 0) {
        const newUser = await this.createUser(
          currentUser.payload.$id,
          currentUser.payload.email,
          currentUser.payload.name,
        )
        if (!newUser.success) {
          throw new Error(newUser.message)
        }
        return {
          success: true,
          message: "Success",
          payload: newUser.payload,
        }
      }

      return {
        success: true,
        message: "Success",
        payload: response.documents[0] as UserDocument,
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  // delete user
  async deleteUserById(userId: string): Promise<DbResponse<void>> {
    try {
      const response = await this.databases.deleteDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID ?? "",
        collectionId.user,
        userId,
      )
      return { success: true, message: "Success", payload: undefined }
    } catch (error) {
      return this.handleError(error)
    }
  }

  // create project
  async createProject(
    name: string,
    description: string,
    fields: {
      name: string
      type: string
      required: boolean
    }[],
  ): Promise<DbResponse<ProjectDocument>> {
    try {
      const currentUser = await this.getCurrentUser()
      if (!currentUser.success) {
        throw new Error(currentUser.message)
      }

      if (
        currentUser.payload.project.length > currentUser.payload.projectLimit
      ) {
        throw new Error("You have reached the maximum number of projects")
      }
      if (currentUser.payload.maxFields < fields.length) {
        throw new Error("You have reached the maximum number of fields")
      }

      const newProject: ProjectDocument = await this.databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID ?? "",
        collectionId.project,
        ID.unique(),
        {
          name,
          description,
          fields: JSON.stringify(fields),
          secret: ID.unique(),
          userId: currentUser.payload.$id,
        },
      )

      const updateUser: UserDocument = await this.databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID ?? "",
        collectionId.user,
        currentUser.payload.$id,
        {
          project: [...currentUser.payload.project, newProject.$id],
        },
      )
      return {
        success: true,
        message: "Success",
        payload: newProject,
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  // find project by id
  async findProjectById(
    projectId: string,
  ): Promise<DbResponse<ProjectDocument>> {
    try {
      const response: ProjectDocument = await this.databases.getDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID ?? "",
        collectionId.project,
        projectId,
      )
      return { success: true, message: "Success", payload: response }
    } catch (error) {
      return this.handleError(error)
    }
  }

  // get all projects of current user
  async getAllProjects(): Promise<DbResponse<ProjectDocument[]>> {
    try {
      const currentUser = await this.getCurrentUser()
      if (!currentUser.success) {
        throw new Error(currentUser.message)
      }

      const response = await this.databases.listDocuments(
        process.env.NEXT_PUBLIC_DATABASE_ID ?? "",
        collectionId.project,
        [Query.equal("userId", currentUser.payload.$id)],
      )
      return {
        success: true,
        message: "Success",
        payload: response.documents as ProjectDocument[],
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  // delete project by id
  async deleteProjectById(projectId: string): Promise<DbResponse<void>> {
    try {
      const response = await this.databases.deleteDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID ?? "",
        collectionId.project,
        projectId,
      )
      return { success: true, message: "Success", payload: undefined }
    } catch (error) {
      return this.handleError(error)
    }
  }

  // create feedback
  async createFeedback(
    data: {
      [key: string]: any
    },
    projectId: string,
    componentId: string,
  ): Promise<DbResponse<FeedbackDocument>> {
    try {
      const currentUser = await this.getCurrentUser()
      if (!currentUser.success) {
        throw new Error(currentUser.message)
      }
      const userId = currentUser.payload.$id

      const response: FeedbackDocument = await this.databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID ?? "",
        collectionId.feedback,
        ID.unique(),
        {
          componentId,
          data: JSON.stringify(data),
        },
      )

      const updateProject = await this.databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID ?? "",
        collectionId.project,
        projectId,
        {
          feedback: response.$id,
        },
      )

      const updateUser = await this.databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID ?? "",
        collectionId.user,
        userId,
        {
          feedback: [...currentUser.payload.feedback, response.$id],
        },
      )

      return {
        success: true,
        message: "Success",
        payload: response,
      }
    } catch (error) {
      return this.handleError(error)
    }
  }

  // update any document
  async updateDocument(
    collection: Collection,
    documentId: string,
    data: {
      [key: string]: any
    },
  ) {
    try {
      const response = await this.databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID ?? "",
        collection,
        documentId,
        data,
      )
      return { success: true, message: "Success", payload: response }
    } catch (error) {
      return this.handleError(error)
    }
  }

  // error handler
  private handleError(error: unknown): ErrorResponse {
    console.error(error)
    if (error instanceof AppwriteException) {
      return { success: false, message: error.message }
    }
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    }
  }
}

export default new DatabaseService()
