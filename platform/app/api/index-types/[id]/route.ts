import { NextResponse } from "next/server";
import { auth } from "../../../actions";
import { db } from "../../../../db";
import { indexTypes } from "../../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

type Params = Promise<{ id: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const subject = await auth();
    if (!subject) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const type = await db.query.indexTypes.findFirst({
      where: eq(indexTypes.id, id),
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
