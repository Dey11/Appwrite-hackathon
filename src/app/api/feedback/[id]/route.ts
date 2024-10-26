import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/appwrite/appwriteServer"
import { Collection } from "@/appwrite/types"
import { ID, Permission, Role } from "node-appwrite"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { databases } = await createAdminClient()

  if (params.id === "") {
    return NextResponse.json(
      {
        message: "No Document found with that id",
      },
      { status: 400 },
    )
  }

  let body
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json(
      {
        message: "Invalid request body",
      },
      { status: 400 },
    )
  }

  console.log(body, "body")

  if (!body || !body.secret) {
    return NextResponse.json(
      {
        message: "Please provide secret",
      },
      { status: 400 },
    )
  }

  try {
    const project = await databases.getDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID ?? "",
      Collection.project,
      params.id,
    )

    if (!project.$id || project.secret != body.secret) {
      return NextResponse.json(
        {
          message: "Invalid secret or project id",
        },
        { status: 400 },
      )
    }
    console.log(project)

    const feedback = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID ?? "",
      Collection.feedback,
      ID.unique(),
      {
        data: JSON.stringify(body.data),
        user: project.userId,
        project: project.$id,
      },
      [...project.$permissions],
    )

    return NextResponse.json(
      {
        message: "Feedback created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        message: "Error creating feedback",
      },
      { status: 500 },
    )
  }
}
