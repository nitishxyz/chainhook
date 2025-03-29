import { NextResponse } from "next/server";
import { auth } from "../../actions";
import { db } from "../../../db";
import {
  indexSubscriptions,
  databaseConnections,
  indexTypes,
  schemaTemplates,
} from "../../../drizzle/schema";
import { eq } from "drizzle-orm";
import { createSubscriptionSchema } from "@/services/api/index-subscriptions";
import { Pool } from "pg";
import { Helius, TransactionType } from "helius-sdk";
import { Resource } from "sst";

const webhookId = Resource.HeliusWebhookId.value;

const helius = new Helius(Resource.HeliusApiKey.value);

interface SchemaTemplate {
  id: string;
  indexTypeId: string;
  schemaVersion: string;
  creationSql: string;
  indexesSql: string[];
  createdAt: string;
  updatedAt: string | null;
}

// GET /api/index-subscriptions
export async function GET() {
  try {
    const subject = await auth();
    if (!subject) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscriptions = await db
      .select()
      .from(indexSubscriptions)
      .where(eq(indexSubscriptions.userId, subject.properties.id))
      .leftJoin(
        databaseConnections,
        eq(indexSubscriptions.connectionId, databaseConnections.id)
      )
      .leftJoin(indexTypes, eq(indexSubscriptions.indexTypeId, indexTypes.id));

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

// POST /api/index-subscriptions
export async function POST(request: Request) {
  try {
    const subject = await auth();
    if (!subject) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    try {
      createSubscriptionSchema.parse(body);
    } catch {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { name, connectionId, indexTypeId, targetTable, addresses } = body;

    // Validate database connection
    const connection = await db
      .select()
      .from(databaseConnections)
      .where(eq(databaseConnections.id, connectionId))
      .limit(1);

    if (!connection[0] || connection[0].userId !== subject.properties.id) {
      return NextResponse.json(
        { error: "Invalid database connection" },
        { status: 400 }
      );
    }

    // Get index type and schema template
    const indexType = await db
      .select()
      .from(indexTypes)
      .where(eq(indexTypes.id, indexTypeId))
      .leftJoin(schemaTemplates, eq(indexTypes.id, schemaTemplates.indexTypeId))
      .limit(1);

    if (!indexType[0]) {
      return NextResponse.json(
        { error: "Invalid index type" },
        { status: 400 }
      );
    }

    // Get the schema template
    const template = indexType[0].schema_templates as SchemaTemplate | null;

    if (!template) {
      return NextResponse.json(
        { error: "No schema template found for this index type" },
        { status: 400 }
      );
    }

    // Deploy schema to the database
    const pool = new Pool({
      host: connection[0].host,
      port: connection[0].port,
      user: connection[0].username,
      password: connection[0].password,
      database: connection[0].database,
      ssl:
        connection[0].sslMode === "require"
          ? { rejectUnauthorized: false }
          : false,
    });

    try {
      // Execute the creation SQL with schema and table name placeholders
      const creationSql = template.creationSql
        .replace(/{schema}/g, "public")
        .replace(/{table_name}/g, targetTable);
      await pool.query(creationSql);

      // Execute the index SQL statements
      for (const indexSql of template.indexesSql) {
        const formattedIndexSql = indexSql
          .replace(/{schema}/g, "public")
          .replace(/{table_name}/g, targetTable);
        await pool.query(formattedIndexSql);
      }
    } catch (dbError) {
      console.error("Error deploying schema:", dbError);
      return NextResponse.json(
        { error: "Failed to deploy schema" },
        { status: 500 }
      );
    } finally {
      await pool.end();
    }

    const allWebhooks = await helius.getAllWebhooks();
    console.log(allWebhooks);

    console.log(
      "Getting Helius webhook",
      webhookId,
      Resource.HeliusApiKey.value
    );
    // Add event and address to Helius webhook
    const webhook = await helius.getWebhookByID(webhookId);
    console.log("Helius webhook retrieved");
    if (!webhook) {
      return NextResponse.json(
        { error: "Failed to get Helius webhook" },
        { status: 500 }
      );
    }

    // check if the transaction type is already in the webhook
    const transactionType =
      TransactionType[
        indexType[0].index_types.id as keyof typeof TransactionType
      ];

    console.log(webhook.transactionTypes, transactionType);

    if (!webhook.transactionTypes.includes(transactionType)) {
      console.log("Adding transaction type to webhook");
      await helius.editWebhook(webhookId, {
        transactionTypes: [...webhook.transactionTypes, transactionType],
      });
      console.log("Transaction type added to webhook");
    }

    console.log("Appending addresses to webhook");
    await helius.appendAddressesToWebhook(webhookId, addresses);
    console.log("Addresses appended to webhook");

    // Create subscription
    const [subscription] = await db
      .insert(indexSubscriptions)
      .values({
        id: crypto.randomUUID(),
        name,
        userId: subject.properties.id,
        connectionId,
        indexTypeId,
        targetTable,
        addresses: addresses || [],
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
