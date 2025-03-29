import { NextResponse } from "next/server";
import { auth } from "../../actions";
import { db } from "../../../db";
import { databaseConnections } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";

// GET /api/database-connections
export async function GET() {
  const subject = await auth();
  if (!subject) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const connections = await db.query.databaseConnections.findMany({
      where: eq(databaseConnections.userId, subject.properties.id),
    });

    return NextResponse.json({ connections });
  } catch (error) {
    console.error("Error fetching database connections:", error);
    return NextResponse.json(
      { error: "Failed to fetch database connections" },
      { status: 500 }
    );
  }
}

// POST /api/database-connections
export async function POST(request: Request) {
  const subject = await auth();
  if (!subject) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, host, port, username, password, database, sslMode } = body;

    const connection = await db
      .insert(databaseConnections)
      .values({
        id: crypto.randomUUID(),
        userId: subject.properties.id,
        name,
        host,
        port,
        username,
        password, // Note: Should be encrypted before storing
        database,
        sslMode: sslMode || "require",
      })
      .returning();

    return NextResponse.json(connection[0]);
  } catch (error) {
    console.error("Error creating database connection:", error);
    return NextResponse.json(
      { error: "Failed to create database connection" },
      { status: 500 }
    );
  }
}
