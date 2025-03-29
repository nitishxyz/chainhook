import { db } from "../index";
import { schemaTemplates } from "../schema/schema-templates";

const templates = [
  {
    id: "transfer_v1",
    indexTypeId: "TRANSFER",
    schemaVersion: "1.0.0",
    creationSql: `
      CREATE TABLE IF NOT EXISTS {schema}.{table_name} (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        signature TEXT NOT NULL,
        slot BIGINT NOT NULL,
        timestamp BIGINT NOT NULL,
        source TEXT NOT NULL,
        fee BIGINT NOT NULL,
        fee_payer TEXT NOT NULL,
        from_address TEXT NOT NULL,
        to_address TEXT NOT NULL,
        amount NUMERIC NOT NULL,
        token_address TEXT,
        token_decimals INTEGER,
        token_amount TEXT,
        from_token_account TEXT,
        to_token_account TEXT,
        token_standard TEXT,
        platform TEXT NOT NULL,
        native_transfers JSONB,
        token_transfers JSONB,
        account_data JSONB,
        instructions JSONB,
        event_signature TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `,
    indexesSql: [
      `CREATE INDEX IF NOT EXISTS {table_name}_signature_idx ON {schema}.{table_name}(signature);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_from_address_idx ON {schema}.{table_name}(from_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_to_address_idx ON {schema}.{table_name}(to_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_token_address_idx ON {schema}.{table_name}(token_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_timestamp_idx ON {schema}.{table_name}(timestamp);`,
    ],
  },
  {
    id: "swap_v1",
    indexTypeId: "SWAP",
    schemaVersion: "1.0.0",
    creationSql: `
      CREATE TABLE IF NOT EXISTS {schema}.{table_name} (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        signature TEXT NOT NULL,
        slot BIGINT NOT NULL,
        timestamp BIGINT NOT NULL,
        source TEXT NOT NULL,
        fee BIGINT NOT NULL,
        fee_payer TEXT NOT NULL,
        wallet_address TEXT NOT NULL,
        dex TEXT NOT NULL,
        token_in_address TEXT NOT NULL,
        token_out_address TEXT NOT NULL,
        amount_in NUMERIC NOT NULL,
        amount_out NUMERIC NOT NULL,
        price_usd NUMERIC,
        token_in_decimals INTEGER,
        token_out_decimals INTEGER,
        token_in_amount TEXT,
        token_out_amount TEXT,
        native_transfers JSONB,
        token_transfers JSONB,
        account_data JSONB,
        instructions JSONB,
        event_signature TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `,
    indexesSql: [
      `CREATE INDEX IF NOT EXISTS {table_name}_signature_idx ON {schema}.{table_name}(signature);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_wallet_address_idx ON {schema}.{table_name}(wallet_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_token_in_address_idx ON {schema}.{table_name}(token_in_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_token_out_address_idx ON {schema}.{table_name}(token_out_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_dex_idx ON {schema}.{table_name}(dex);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_timestamp_idx ON {schema}.{table_name}(timestamp);`,
    ],
  },
];

export async function seedSchemaTemplates() {
  console.log("Seeding schema templates...");

  for (const template of templates) {
    await db.insert(schemaTemplates).values(template).onConflictDoNothing();
  }

  console.log("Schema templates seeded successfully");
}
