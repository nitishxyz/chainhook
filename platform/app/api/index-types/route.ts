import { NextResponse } from "next/server";
import { auth } from "../../actions";
import { db } from "../../../db";

export async function GET() {
  try {
    const subject = await auth();
    if (!subject) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const types = await db.query.indexTypes.findMany({
      orderBy: (indexTypes, { asc }) => [asc(indexTypes.name)],
    });

    return NextResponse.json({ indexTypes: types });
  } catch (error) {
    console.error("Error fetching index types:", error);
    return NextResponse.json(
      { error: "Failed to fetch index types" },
      { status: 500 }
    );
  }
}
