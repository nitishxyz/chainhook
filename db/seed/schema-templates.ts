import { db } from "../index";
import { schemaTemplates } from "../schema/schema-templates";

const templates = [
  {
    id: "nft_mint_v1",
    indexTypeId: "NFT_MINT",
    schemaVersion: "1.0.0",
    creationSql: `
      CREATE TABLE IF NOT EXISTS {schema}.{table_name} (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nft_address TEXT NOT NULL,
        mint_address TEXT NOT NULL,
        owner_address TEXT NOT NULL,
        platform TEXT NOT NULL,
        event_signature TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `,
    indexesSql: [
      `CREATE INDEX IF NOT EXISTS {table_name}_nft_address_idx ON {schema}.{table_name}(nft_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_mint_address_idx ON {schema}.{table_name}(mint_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_owner_address_idx ON {schema}.{table_name}(owner_address);`,
    ],
  },
  {
    id: "nft_bid_v1",
    indexTypeId: "NFT_BID",
    schemaVersion: "1.0.0",
    creationSql: `
      CREATE TABLE IF NOT EXISTS {schema}.{table_name} (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nft_address TEXT NOT NULL,
        bidder_address TEXT NOT NULL,
        marketplace TEXT NOT NULL,
        price NUMERIC NOT NULL,
        price_usd NUMERIC,
        currency TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        expires_at TIMESTAMP,
        event_signature TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `,
    indexesSql: [
      `CREATE INDEX IF NOT EXISTS {table_name}_nft_address_idx ON {schema}.{table_name}(nft_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_bidder_address_idx ON {schema}.{table_name}(bidder_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_marketplace_idx ON {schema}.{table_name}(marketplace);`,
    ],
  },
  {
    id: "nft_sale_v1",
    indexTypeId: "NFT_SALE",
    schemaVersion: "1.0.0",
    creationSql: `
      CREATE TABLE IF NOT EXISTS {schema}.{table_name} (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nft_address TEXT NOT NULL,
        seller_address TEXT NOT NULL,
        buyer_address TEXT NOT NULL,
        marketplace TEXT NOT NULL,
        price NUMERIC NOT NULL,
        price_usd NUMERIC,
        currency TEXT,
        event_signature TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `,
    indexesSql: [
      `CREATE INDEX IF NOT EXISTS {table_name}_nft_address_idx ON {schema}.{table_name}(nft_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_seller_address_idx ON {schema}.{table_name}(seller_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_buyer_address_idx ON {schema}.{table_name}(buyer_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_marketplace_idx ON {schema}.{table_name}(marketplace);`,
    ],
  },
  {
    id: "nft_listing_v1",
    indexTypeId: "NFT_LISTING",
    schemaVersion: "1.0.0",
    creationSql: `
      CREATE TABLE IF NOT EXISTS {schema}.{table_name} (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        nft_address TEXT NOT NULL,
        seller_address TEXT NOT NULL,
        marketplace TEXT NOT NULL,
        price NUMERIC NOT NULL,
        price_usd NUMERIC,
        currency TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        event_signature TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `,
    indexesSql: [
      `CREATE INDEX IF NOT EXISTS {table_name}_nft_address_idx ON {schema}.{table_name}(nft_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_seller_address_idx ON {schema}.{table_name}(seller_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_marketplace_idx ON {schema}.{table_name}(marketplace);`,
    ],
  },
  {
    id: "token_mint_v1",
    indexTypeId: "TOKEN_MINT",
    schemaVersion: "1.0.0",
    creationSql: `
      CREATE TABLE IF NOT EXISTS {schema}.{table_name} (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        token_address TEXT NOT NULL,
        mint_address TEXT NOT NULL,
        owner_address TEXT NOT NULL,
        platform TEXT NOT NULL,
        event_signature TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `,
    indexesSql: [
      `CREATE INDEX IF NOT EXISTS {table_name}_token_address_idx ON {schema}.{table_name}(token_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_mint_address_idx ON {schema}.{table_name}(mint_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_owner_address_idx ON {schema}.{table_name}(owner_address);`,
    ],
  },
  {
    id: "transfer_v1",
    indexTypeId: "TRANSFER",
    schemaVersion: "1.0.0",
    creationSql: `
      CREATE TABLE IF NOT EXISTS {schema}.{table_name} (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        from_address TEXT NOT NULL,
        to_address TEXT NOT NULL,
        amount NUMERIC NOT NULL,
        token_address TEXT,
        platform TEXT NOT NULL,
        event_signature TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `,
    indexesSql: [
      `CREATE INDEX IF NOT EXISTS {table_name}_from_address_idx ON {schema}.{table_name}(from_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_to_address_idx ON {schema}.{table_name}(to_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_token_address_idx ON {schema}.{table_name}(token_address);`,
    ],
  },
  {
    id: "swap_v1",
    indexTypeId: "SWAP",
    schemaVersion: "1.0.0",
    creationSql: `
      CREATE TABLE IF NOT EXISTS {schema}.{table_name} (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        wallet_address TEXT NOT NULL,
        dex TEXT NOT NULL,
        token_in_address TEXT NOT NULL,
        token_out_address TEXT NOT NULL,
        amount_in NUMERIC NOT NULL,
        amount_out NUMERIC NOT NULL,
        price_usd NUMERIC,
        event_signature TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `,
    indexesSql: [
      `CREATE INDEX IF NOT EXISTS {table_name}_wallet_address_idx ON {schema}.{table_name}(wallet_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_token_in_address_idx ON {schema}.{table_name}(token_in_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_token_out_address_idx ON {schema}.{table_name}(token_out_address);`,
      `CREATE INDEX IF NOT EXISTS {table_name}_dex_idx ON {schema}.{table_name}(dex);`,
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

seedSchemaTemplates();
