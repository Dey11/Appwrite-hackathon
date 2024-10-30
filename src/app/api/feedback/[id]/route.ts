import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/appwrite/appwriteServer"
import { Collection } from "@/appwrite/types"
import { ID, Permission, Role } from "node-appwrite"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

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
      { status: 400, headers: corsHeaders },
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
      { status: 400, headers: corsHeaders },
    )
  }

  console.log(body, "body")

  if (!body || !body.secret) {
    return NextResponse.json(
      {
        message: "Please provide secret",
      },
      { status: 400, headers: corsHeaders },
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
        { status: 400, headers: corsHeaders },
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
      { status: 201, headers: corsHeaders },
    )
  } catch (error) {
    console.log(error)

    return NextResponse.json(
      {
        message: "Error creating feedback",
      },
      { status: 500, headers: corsHeaders },
    )
  }
}
