"use server"
import { createAdminClient } from "@/appwrite/appwriteServer"
import { Collection, DbResponse } from "@/appwrite/types"
import { ID } from "node-appwrite"

export async function createFeedbackAction(
  data: {
    [key: string]: any
  },
  projectId: string,
  userId: string,
  permissions: [string],
): Promise<DbResponse<string>> {
  try {

    const { databases } = await createAdminClient()

    const response = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID ?? "",
      Collection.feedback,
      ID.unique(),
      {
        data: JSON.stringify(data),
        user: userId,
        project: projectId,
      },
      [...permissions],
    )


    return {
      success: true,
      message: "Success",
      payload: "success",
    }
  } catch (error) {

    return {
      success: false,
      message: error as string,
    }
  }
}
