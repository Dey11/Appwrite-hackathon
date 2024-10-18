import { Models } from "appwrite"

export type User = Models.User<Models.Preferences>
export type Session = Models.Session

export type AuthSuccess<T> = {
  success: true
  message: string
  payload: T
}

export type ErrorResponse = {
  success: false
  message: string
}

export type AuthResponse<T> = AuthSuccess<T> | ErrorResponse

export type DbSuccess<T> = {
  success: true
  message: string
  payload: T
}

export type DbResponse<T> = DbSuccess<T> | ErrorResponse

interface UserProperties {
  name: string
  email: string
  accountId: string
  projectLimit: number
  maxFields: number
  project: ProjectDocument[] | []
  feedback: FeedbackDocument[] | []
}

interface ProjectProperties {
  name: string
  secret: string
  live: boolean
  image: string
  description: string
  fields: string
  userId: string
  feedback: FeedbackDocument
}

interface FeedbackProperties {
  componentId: string
  data: string
  user: UserDocument
  project: ProjectDocument
}

export interface UserDocument extends Models.Document, UserProperties {}
// const ok: UserDocument = {} as UserDocument

export interface ProjectDocument extends Models.Document, ProjectProperties {}

export interface FeedbackDocument extends Models.Document, FeedbackProperties {}

export enum Collection {
  user = "6711f9f90001ee20d5e1",
  project = "6711fa430021998ea7ca",
  feedback = "6711fa080018a94a875c",
}
