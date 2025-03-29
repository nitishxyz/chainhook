import { NextResponse } from "next/server";
import { Pool } from "pg";
import { testConnectionSchema } from "@/services/api/connections";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = testConnectionSchema.parse(body);

    const pool = new Pool({
      host: validatedData.host,
      port: validatedData.port,
      user: validatedData.username,
      password: validatedData.password,
      database: validatedData.database,
      ssl:
        validatedData.sslMode === "disable"
          ? false
          : {
              rejectUnauthorized: validatedData.sslMode === "verify-full",
            },
      connectionTimeoutMillis: 5000, // 5 second timeout
    });

    const client = await pool.connect();
    try {
      // Test connection and get database info
      const versionResult = await client.query(
        "SELECT split_part(version(), ' ', 2) as version"
      );
      const schemasResult = await client.query(
        "SELECT string_agg(schema_name, ', ') as schemas FROM information_schema.schemata WHERE schema_name NOT IN ('information_schema', 'pg_catalog')"
      );
      const extensionsResult = await client.query(
        "SELECT string_agg(extname || ' (' || extversion || ')', ', ') as extensions FROM pg_extension"
      );

      return NextResponse.json({
        success: true,
        message: "Connection successful",
        data: {
          version: versionResult.rows[0].version,
          schemas: schemasResult.rows[0].schemas.split(", "),
          tables:
            schemasResult.rows[0].tables?.split(", ").map((t: string) => {
              const [schema, name] = t.split(".");
              return { schema, name };
            }) || [],
          extensions:
            extensionsResult.rows[0].extensions
              ?.split(", ")
              .map((e: string) => {
                const [name, version] = e.split(" (");
                return { name, version: version.slice(0, -1) };
              }) || [],
        },
      });
    } finally {
      client.release();
      await pool.end();
    }
  } catch (error) {
    console.error("Database connection error:", error);

    // Handle specific database errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes("connection refused")) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Could not connect to the database server. Please check if the server is running and the host/port are correct.",
          },
          { status: 400 }
        );
      }

      if (errorMessage.includes("password authentication failed")) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Authentication failed. Please check your username and password.",
          },
          { status: 401 }
        );
      }

      if (
        errorMessage.includes("database") &&
        errorMessage.includes("does not exist")
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "The specified database does not exist. Please check the database name.",
          },
          { status: 400 }
        );
      }

      if (errorMessage.includes("timeout")) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Connection timed out. Please check if the database server is accessible and not blocking connections.",
          },
          { status: 408 }
        );
      }

      if (errorMessage.includes("ssl")) {
        return NextResponse.json(
          {
            success: false,
            message:
              "SSL connection failed. Please check your SSL configuration and certificates.",
          },
          { status: 400 }
        );
      }

      if (errorMessage.includes("permission denied")) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Permission denied. Please check if the user has the necessary database permissions.",
          },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to connect to the database. Please check your connection details and try again.",
      },
      { status: 500 }
    );
  }
}
