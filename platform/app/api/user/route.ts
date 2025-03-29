import { auth } from "@/app/actions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const subject = await auth();

    if (!subject) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      username: subject.properties.username,
      id: subject.properties.id,
      email: subject.properties.email,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
