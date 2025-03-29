# Chainhook Project Context

## Project Overview

Chainhook is a blockchain indexing platform that enables developers to easily integrate Solana blockchain data into their PostgreSQL databases using Helius webhooks.

## Technical Stack

- Framework: SST (AWS CDK-based framework)
- Database: PostgreSQL with Drizzle ORM
- Authentication: OpenAuth.js
- Infrastructure: AWS (Lambda, Aurora, API Gateway)
- Webhook Provider: Helius

## Core Infrastructure Components

1. **Database**

   - Aurora PostgreSQL instance
   - Local development support (port 5433)
   - Connection pooling configured

2. **Authentication**

   - OpenAuth.js integration
   - GitHub OAuth provider configured
   - No custom auth tables needed

3. **API Layer**
   - Lambda-based webhook endpoint
   - API Gateway integration
   - Helius webhook processing

## Database Schema Structure

### Current Tables

1. **Users Table** (Implemented)

```typescript
users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  username: varchar("username").unique().notNull(),
  email: varchar("email").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
});
```

### Required Tables (To Be Implemented)

1. **User Connections**

   - Stores PostgreSQL connection details
   - Encrypted credential storage
   - Connection health monitoring

2. **Index Types**

   - Predefined indexing categories
   - Schema templates
   - Example queries

3. **Index Subscriptions**

   - User's active indexing choices
   - Configuration and filtering
   - Status tracking

4. **Schema Templates**

   - Table creation templates
   - Index definitions
   - Sample queries

5. **Webhook Events**
   - Event processing queue
   - Error tracking
   - Retry management

## Webhook Integration

1. **Event Types**

   - NFT Events (sales, bids, transfers)
   - Token Events (swaps, transfers)
   - Account Events (state changes)

2. **Processing Flow**
   Helius → API Gateway → Lambda → Event Processor → User Database Writers

3. **Event Examples**
   - NFT Sales
   - Token Swaps
   - Account Updates

## Development Environment

- Local PostgreSQL support
- Drizzle migrations
- SST development tunnel
- Database studio tools

## File Structure

```
/db
  /schema/
    users.ts
    index.ts
    [other schema files to be created]
/auth
  auth.ts
/infra
  database.ts
  vpc.ts
```

## Configuration

- SST-managed infrastructure
- Environment-specific database configs
- Drizzle ORM setup
- SSL configuration (currently disabled for development)
