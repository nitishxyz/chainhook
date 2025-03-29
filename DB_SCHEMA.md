# Database Schema for Chainhook

## Internal Database Schema

### users (existing table)
- id: UUID PRIMARY KEY
- email: TEXT NOT NULL UNIQUE
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()

### user_connections
- id: UUID PRIMARY KEY
- user_id: UUID REFERENCES users(id)
- name: TEXT NOT NULL
- host: TEXT NOT NULL
- port: INTEGER NOT NULL DEFAULT 5432
- username: TEXT NOT NULL
- password: TEXT NOT NULL (encrypted)
- database: TEXT NOT NULL
- ssl_mode: TEXT DEFAULT 'require'
- status: TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'error'))
- last_connected_at: TIMESTAMP
- last_error: TEXT
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()

### index_types
- id: UUID PRIMARY KEY
- name: TEXT NOT NULL UNIQUE
- description: TEXT
- example_query: TEXT
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()

### index_subscriptions
- id: UUID PRIMARY KEY
- user_id: UUID REFERENCES users(id)
- connection_id: UUID REFERENCES user_connections(id)
- index_type_id: UUID REFERENCES index_types(id)
- status: TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'error'))
- target_schema: TEXT DEFAULT 'public'
- target_table: TEXT NOT NULL
- filter_criteria: JSONB
- last_indexed_at: TIMESTAMP
- last_error: TEXT
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()

### schema_templates
- id: UUID PRIMARY KEY
- index_type_id: UUID REFERENCES index_types(id)
- schema_version: TEXT NOT NULL
- creation_sql: TEXT NOT NULL
- indexes_sql: TEXT[] NOT NULL DEFAULT '{}'
- sample_queries: JSONB
- created_at: TIMESTAMP DEFAULT NOW()
- updated_at: TIMESTAMP DEFAULT NOW()

### webhook_events
- id: UUID PRIMARY KEY
- signature: TEXT UNIQUE
- webhook_id: TEXT NOT NULL
- event_type: TEXT NOT NULL
- payload: JSONB NOT NULL
- processed: BOOLEAN DEFAULT FALSE
- processed_at: TIMESTAMP
- error_count: INTEGER DEFAULT 0
- last_error: TEXT
- created_at: TIMESTAMP DEFAULT NOW()

## External User Database Schema Examples

### NFT Bids (nft_bids)
```sql
CREATE TABLE IF NOT EXISTS {schema}.{table_name} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mint_address TEXT NOT NULL,
  bidder_address TEXT NOT NULL,
  marketplace TEXT NOT NULL,
  price NUMERIC NOT NULL,
  price_usd NUMERIC,
  currency TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  expires_at TIMESTAMP,
  event_signature TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX {table_name}_mint_address_idx ON {schema}.{table_name}(mint_address);
CREATE INDEX {table_name}_bidder_address_idx ON {schema}.{table_name}(bidder_address);
```

### Token Prices (token_prices)
```sql
CREATE TABLE IF NOT EXISTS {schema}.{table_name} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_address TEXT NOT NULL,
  platform TEXT NOT NULL,
  price_usd NUMERIC,
  price_sol NUMERIC,
  liquidity NUMERIC,
  volume_24h NUMERIC,
  last_traded_at TIMESTAMP,
  event_signature TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX {table_name}_token_address_idx ON {schema}.{table_name}(token_address);
CREATE INDEX {table_name}_platform_idx ON {schema}.{table_name}(platform);
```

### Lending Pools (lending_pools)
```sql
CREATE TABLE IF NOT EXISTS {schema}.{table_name} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_address TEXT NOT NULL,
  token_address TEXT NOT NULL,
  supply_amount NUMERIC,
  borrow_amount NUMERIC,
  supply_apy NUMERIC,
  borrow_apy NUMERIC,
  utilization_rate NUMERIC,
  event_signature TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX {table_name}_pool_address_idx ON {schema}.{table_name}(pool_address);
CREATE INDEX {table_name}_token_address_idx ON {schema}.{table_name}(token_address);
```