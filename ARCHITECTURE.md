# Chainhook Architecture

## Overview
Chainhook is a blockchain indexing platform that enables developers to easily integrate and index Solana blockchain data into their Postgres databases using Helius webhooks.

## Core Components

### 1. Webhook Management
- Single webhook endpoint exposed to Helius (Lambda function)
- Event router that processes webhook payloads and distributes to appropriate handlers
- Event filtering based on user subscription preferences

### 2. User Database (Internal)
- User authentication and management
- Storage of user DB credentials (encrypted)
- Index configuration preferences
- Webhook subscription mappings

### 3. Schema Management
- Predefined schemas for common indexing patterns
- Dynamic schema generation for user databases
- Schema version control and migration support

### 4. Data Processing Pipeline
- Event validation and normalization
- Data transformation based on subscription type
- Concurrent database writers for performance
- Retry and error handling mechanisms

## Data Models (MVP)

### User Connections
- Database credentials (host, port, username, password, database name)
- Connection status
- Test connection results
- Last connection timestamp

### Index Subscriptions
- Type of data to index (NFT bids, token prices, etc.)
- Entity identifiers (collection addresses, token mints)
- Frequency of updates
- Filtering criteria
- Target schema/table configuration

### Schema Templates
- Predefined database schemas for each subscription type
- DDL statements for table creation
- Index definitions for performance
- Sample queries for documentation

## Webhook Strategy
- Use a single Helius webhook endpoint for all events
- Filter events in the Lambda based on user subscriptions
- Maintain connection pool for frequent database targets
- Batch similar operations for efficiency

## Scaling Considerations
- Database connection pooling
- Event queue for traffic spikes
- Rate limiting per user/database
- Gradual schema migrations