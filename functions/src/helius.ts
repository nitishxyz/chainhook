import type { APIGatewayProxyEvent, Handler } from "aws-lambda";
import { Pool } from "pg";
import { db } from "../../db";
import { indexSubscriptions, databaseConnections } from "../../db/schema";
import { eq, and, sql } from "drizzle-orm";

interface TokenTransfer {
  fromUserAccount: string;
  toUserAccount: string;
  mint: string;
  tokenAmount: number;
  tokenStandard: string;
  fromTokenAccount: string;
  toTokenAccount: string;
}

interface Transaction {
  type: string;
  signature: string;
  slot: number;
  timestamp: number;
  source: string;
  fee: number;
  feePayer: string;
  tokenTransfers: TokenTransfer[];
  nativeTransfers: {
    amount: number;
    fromUserAccount: string;
    toUserAccount: string;
  }[];
}

interface Subscription {
  id: string;
  targetSchema: string | null;
  targetTable: string;
  addresses: string[];
  connection: {
    host: string;
    port: number;
    database: string;
    username: string;
    password: string;
  };
}

export const handler: Handler<APIGatewayProxyEvent> = async (event) => {
  try {
    console.log("Received webhook event");
    const transactions: Transaction[] = JSON.parse(event.body || "[]");
    console.log(`Processing ${transactions.length} transactions`);

    for (const tx of transactions) {
      console.log(`\nProcessing transaction: ${tx.signature}`);
      console.log(`Transaction type: ${tx.type}`);

      // Get relevant subscriptions based on transaction type
      const subs = await getRelevantSubscriptions(tx);
      console.log(`Found ${subs.length} relevant subscriptions`);

      // Process each subscription
      for (const sub of subs) {
        console.log(`\nProcessing subscription: ${sub.id}`);
        console.log(`Target: ${sub.targetSchema}.${sub.targetTable}`);
        await processTransaction(tx, sub);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Transactions processed successfully" }),
    };
  } catch (error) {
    console.error("Error processing webhook:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process transactions" }),
    };
  }
};

async function getRelevantSubscriptions(
  tx: Transaction
): Promise<Subscription[]> {
  const indexTypeId =
    tx.type === "TRANSFER" ? "TRANSFER" : tx.type === "SWAP" ? "SWAP" : null;

  if (!indexTypeId) {
    console.log(`No matching index type for transaction type: ${tx.type}`);
    return [];
  }

  // Get all addresses involved in the transaction
  const txAddresses = [
    ...tx.tokenTransfers.map((t) => t.fromUserAccount),
    ...tx.tokenTransfers.map((t) => t.toUserAccount),
    ...tx.nativeTransfers.map((t) => t.fromUserAccount),
    ...tx.nativeTransfers.map((t) => t.toUserAccount),
    tx.feePayer,
  ];

  console.log(`Looking for subscriptions with index type: ${indexTypeId}`);
  console.log(`Checking addresses: ${txAddresses.join(", ")}`);

  // Get all active subscriptions for this index type with their connection details
  const subs = await db
    .select({
      id: indexSubscriptions.id,
      targetSchema: indexSubscriptions.targetSchema,
      targetTable: indexSubscriptions.targetTable,
      addresses: indexSubscriptions.addresses,
      connection: {
        host: databaseConnections.host,
        port: databaseConnections.port,
        database: databaseConnections.database,
        username: databaseConnections.username,
        password: databaseConnections.password,
      },
    })
    .from(indexSubscriptions)
    .innerJoin(
      databaseConnections,
      eq(indexSubscriptions.connectionId, databaseConnections.id)
    )
    .where(
      and(
        eq(indexSubscriptions.indexTypeId, indexTypeId),
        eq(indexSubscriptions.status, "active"),
        // Check if any of the transaction addresses match the subscription's addresses
        sql`${indexSubscriptions.addresses} && ${txAddresses}::text[]`
      )
    );

  console.log(`Found ${subs.length} relevant subscriptions`);
  return subs as unknown as Subscription[];
}

async function processTransaction(tx: Transaction, subscription: any) {
  console.log(
    `Creating connection pool for database: ${subscription.connection.database}`
  );

  // Create connection pool for the target database
  const pool = new Pool({
    host: subscription.connection.host,
    port: subscription.connection.port,
    database: subscription.connection.database,
    user: subscription.connection.username,
    password: subscription.connection.password,
    ssl: false,
  });

  try {
    console.log(
      `Processing ${tx.type} transaction for subscription ${subscription.id}`
    );
    if (tx.type === "TRANSFER") {
      await processTransfer(tx, pool, subscription);
    } else if (tx.type === "SWAP") {
      await processSwap(tx, pool, subscription);
    }
    console.log(`Successfully processed transaction ${tx.signature}`);
  } catch (error) {
    console.error(`Error processing transaction ${tx.signature}:`, error);
    throw error;
  } finally {
    await pool.end();
    console.log(
      `Closed connection pool for ${subscription.connection.database}`
    );
  }
}

async function processTransfer(tx: Transaction, pool: Pool, subscription: any) {
  const tokenTransfer = tx.tokenTransfers[0];
  console.log(`Processing transfer: ${tokenTransfer?.mint || "native SOL"}`);

  const query = `
    INSERT INTO ${subscription.targetSchema}.${subscription.targetTable} (
      signature, slot, timestamp, source, fee, fee_payer,
      from_address, to_address, amount, token_address,
      token_decimals, token_amount, from_token_account,
      to_token_account, token_standard, platform,
      native_transfers, token_transfers, account_data,
      instructions, event_signature
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
  `;

  const params = [
    tx.signature,
    tx.slot,
    tx.timestamp,
    tx.source,
    tx.fee,
    tx.feePayer,
    tokenTransfer?.fromUserAccount || tx.nativeTransfers[0]?.fromUserAccount,
    tokenTransfer?.toUserAccount || tx.nativeTransfers[0]?.toUserAccount,
    tokenTransfer?.tokenAmount || tx.nativeTransfers[0]?.amount,
    tokenTransfer?.mint || null,
    tokenTransfer?.tokenStandard === "Fungible" ? 6 : null,
    tokenTransfer?.tokenAmount?.toString() || null,
    tokenTransfer?.fromTokenAccount || null,
    tokenTransfer?.toTokenAccount || null,
    tokenTransfer?.tokenStandard || null,
    tx.source,
    JSON.stringify(tx.nativeTransfers),
    JSON.stringify(tx.tokenTransfers),
    null, // account_data
    null, // instructions
    tx.signature,
  ];

  await pool.query(query, params);
  console.log(`Inserted transfer record for ${tx.signature}`);
}

async function processSwap(tx: Transaction, pool: Pool, subscription: any) {
  const tokenTransfer = tx.tokenTransfers[0];
  console.log(`Processing swap for token: ${tokenTransfer.mint}`);

  // Find the second token transfer to get token_out details
  const tokenOutTransfer = tx.tokenTransfers.find(
    (t) => t.mint !== tokenTransfer.mint
  );

  if (!tokenOutTransfer) {
    console.error(
      `No matching token out transfer found for swap ${tx.signature}`
    );
    return;
  }

  console.log(
    `Token in: ${tokenTransfer.mint}, Token out: ${tokenOutTransfer.mint}`
  );

  const query = `
    INSERT INTO ${subscription.targetSchema}.${subscription.targetTable} (
      signature, slot, timestamp, source, fee, fee_payer,
      wallet_address, dex, token_in_address, token_out_address,
      amount_in, amount_out, token_in_decimals, token_out_decimals,
      token_in_amount, token_out_amount, native_transfers,
      token_transfers, account_data, instructions, event_signature
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
  `;

  const params = [
    tx.signature,
    tx.slot,
    tx.timestamp,
    tx.source,
    tx.fee,
    tx.feePayer,
    tokenTransfer.fromUserAccount,
    tx.source, // dex
    tokenTransfer.mint, // token_in_address
    tokenOutTransfer.mint, // token_out_address
    tokenTransfer.tokenAmount,
    tokenOutTransfer.tokenAmount, // amount_out
    tokenTransfer.tokenStandard === "Fungible" ? 6 : null,
    tokenOutTransfer.tokenStandard === "Fungible" ? 6 : null, // token_out_decimals
    tokenTransfer.tokenAmount.toString(),
    tokenOutTransfer.tokenAmount.toString(), // token_out_amount
    JSON.stringify(tx.nativeTransfers),
    JSON.stringify(tx.tokenTransfers),
    null, // account_data
    null, // instructions
    tx.signature,
  ];

  await pool.query(query, params);
  console.log(`Inserted swap record for ${tx.signature}`);
}
