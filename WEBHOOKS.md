# Helius Webhook Integration

## Overview
Chainhook uses a single Helius webhook endpoint to receive blockchain events for all users. This design allows us to maintain fewer webhook connections while still supporting many users with diverse indexing needs.

## Webhook Setup

### Configuration with Helius
1. Create a single webhook in Helius dashboard with these settings:
   - URL: `https://api.chainhook.xyz/webhooks/helius` (Lambda function endpoint)
   - Auth header: Bearer token for webhook authentication
   - Events: All relevant Solana events (transactions, NFT events, token events)

2. Register account-addresses for monitoring:
   - Add NFT collections, token mints, marketplaces based on user subscriptions
   - Create account watchers programmatically via Helius API

### Webhook Processing Flow
```
Helius → API Gateway → Lambda → Event Processor → User Database Writers
```

## Event Types

### NFT Events
- Listings
- Sales
- Bids/Offers
- Cancellations
- Transfers

### Token Events
- Swaps
- Transfers
- Mints/Burns
- Liquidity changes

### Account Events
- Balance changes
- State changes
- Program interactions

## Event Payload Examples

### NFT Sale
```json
{
  "type": "NFT_SALE",
  "account": "2Pg...",
  "amount": 5000000000,
  "buyer": "7vJ...",
  "seller": "2Tf...",
  "fee": 250000000,
  "signature": "4QJ...",
  "slot": 171966831,
  "timestamp": 1683034820
}
```

### Token Swap
```json
{
  "type": "SWAP",
  "accountA": "EPj...",
  "accountB": "So1...",
  "amountA": 1000000,
  "amountB": 25000000,
  "source": "ORCA",
  "signature": "5xG...",
  "slot": 171966835,
  "timestamp": 1683034823
}
```

## Subscription Management

### Combining Subscriptions
- Group similar subscriptions to minimize Helius webhook registrations
- Use account grouping where possible (e.g., all NFTs in a collection)

### Dynamic Subscription Updates
- Periodically sync account registrations with Helius
- Add new accounts as users create subscriptions
- Remove unused accounts to optimize webhook performance

## Error Handling

### Webhook Failures
- Implement retry logic with exponential backoff
- Store failed events in webhook_events table with error details
- Alert on persistent failures

### Rate Limiting
- Monitor Helius rate limits and throttle as needed
- Implement queuing system for high volume periods
- Prioritize processing based on subscription tiers