import { NextResponse } from "next/server";
import { auth } from "../../../actions";
import { db } from "../../../../db";
import { databaseConnections } from "../../../../drizzle/schema";
import { eq, and } from "drizzle-orm";

// GET /api/database-connections/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const subject = await auth();
  if (!subject) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const connection = await db.query.databaseConnections.findFirst({
      where: and(
        eq(databaseConnections.id, params.id),
        eq(databaseConnections.userId, subject.properties.id)
      ),
    });

    if (!connection) {
      return NextResponse.json(
        { error: "Database connection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ connection });
  } catch (error) {
    console.error("Error fetching database connection:", error);
    return NextResponse.json(
      { error: "Failed to fetch database connection" },
      { status: 500 }
    );
  }
}

// PATCH /api/database-connections/[id]
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const subject = await auth();
  if (!subject) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, host, port, username, password, database, sslMode } = body;

    const connection = await db
      .update(databaseConnections)
      .set({
        name,
        host,
        port,
        username,
        password, // Note: Should be encrypted before storing
        database,
        sslMode: sslMode || "require",
        updatedAt: new Date().toISOString(),
      })
      .where(
        and(
          eq(databaseConnections.id, params.id),
          eq(databaseConnections.userId, subject.properties.id)
        )
      )
      .returning();

    if (!connection[0]) {
      return NextResponse.json(
        { error: "Database connection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(connection[0]);
  } catch (error) {
    console.error("Error updating database connection:", error);
    return NextResponse.json(
      { error: "Failed to update database connection" },
      { status: 500 }
    );
  }
}

// DELETE /api/database-connections/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const subject = await auth();
  if (!subject) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const connection = await db
      .delete(databaseConnections)
      .where(
        and(
          eq(databaseConnections.id, params.id),
          eq(databaseConnections.userId, subject.properties.id)
        )
      )
      .returning();

    if (!connection[0]) {
      return NextResponse.json(
        { error: "Database connection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting database connection:", error);
    return NextResponse.json(
      { error: "Failed to delete database connection" },
      { status: 500 }
    );
  }
}
