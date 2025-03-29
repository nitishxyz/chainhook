import { NextResponse } from "next/server";
import { auth } from "../../../actions";
import { db } from "../../../../db";
import { indexTypes } from "../../../../drizzle/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const subject = await auth();
    if (!subject) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const type = await db.query.indexTypes.findFirst({
      where: eq(indexTypes.id, params.id),
    });

    if (!type) {
      return NextResponse.json(
        { error: "Index type not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(type);
  } catch (error) {
    console.error("Error fetching index type:", error);
    return NextResponse.json(
      { error: "Failed to fetch index type" },
      { status: 500 }
    );
  }
}
