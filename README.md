# Chainhook

Chainhook is a blockchain indexing platform that enables developers to easily integrate and index Solana blockchain data into their Postgres databases using Helius webhooks.

## Prerequisites

- Node.js (v18 or later)
- AWS CLI configured with appropriate credentials
- Docker (for local development)
- GitHub account (for authentication)
- Helius account (for Solana blockchain data)

## Project Structure

```
chainhook/
├── auth/           # Authentication service (OpenAuth)
├── platform/       # Main web application (Next.js)
├── functions/      # Lambda functions
├── infra/         # SST infrastructure code
├── db/            # Database migrations and schemas
└── drizzle/       # Drizzle ORM configuration
```

## Infrastructure Components

The project is built using SST (Serverless Stack) and deploys the following components to AWS:

- **Platform**: Next.js web application (OpenNext)
- **Auth**: Authentication service (OpenAuth)
- **Database**: Aurora PostgreSQL
- **VPC**: Network infrastructure
- **Lambda Functions**: Webhook handlers and API endpoints
- **Helius Integration**: Solana blockchain data processing

## Local Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/nitishxyz/chainhook.git
   cd chainhook
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up local PostgreSQL**

   ```bash
   docker run -d \
     --name chainhook-db \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -e POSTGRES_DB=postgres \
     -p 5433:5432 \
     postgres:latest
   ```

4. **Configure Secrets**
   Use SST's secrets management system to set up required secrets:

   ```bash
   # Set GitHub OAuth credentials
   npx sst secrets set GithubClientId "your-github-client-id" --stage dev
   npx sst secrets set GithubClientSecret "your-github-client-secret" --stage dev

   # Set Helius credentials
   npx sst secrets set HeliusApiKey "your-helius-api-key" --stage dev
   npx sst secrets set HeliusRpcUrl "your-helius-rpc-url" --stage dev
   npx sst secrets set HeliusWebhookId "your-helius-webhook-id" --stage dev
   ```

   Required secrets (as defined in `infra/secrets.ts`):

   - `GithubClientId`: GitHub OAuth App Client ID
   - `GithubClientSecret`: GitHub OAuth App Client Secret
   - `HeliusApiKey`: Helius API Key
   - `HeliusRpcUrl`: Helius RPC URL
   - `HeliusWebhookId`: Helius Webhook ID

5. **Set up GitHub OAuth**

   - Go to GitHub Developer Settings
   - Create a new OAuth App
   - Set the callback URL to `https://dev.auth.chainhook.org/github/callback` for development
   - Set the callback URL to `https://auth.chainhook.org/github/callback` for production
   - Copy the Client ID and Client Secret to your secrets using SST secrets management

6. **Set up Helius**

   - Create an account at [Helius](https://helius.dev)
   - Generate API keys and RPC URL
   - Set up a webhook endpoint

7. **Start the development server**
   ```bash
   npx sst dev
   ```

## Database Management

The project uses Drizzle ORM for database operations. To manage the database:

1. **Run Drizzle CLI commands**

   ```bash
   # Run any drizzle-kit command
   npm run db

   # Run drizzle-kit commands in dev stage
   npm run dev:db
   ```

2. **Database Seeding**

   ```bash
   # Run database seed
   npm run seed

   # Run database seed in dev stage
   npm run dev:seed
   ```

3. **Database Studio**

   ```bash
   # Open Drizzle Studio in dev stage
   npm run dev:studio
   ```

4. **Database Tunnel**
   ```bash
   # Create a tunnel to the database
   npm run dev:tunnel
   ```

## Deployment

The project supports multiple deployment stages:

- **Development**: Deploys to dev environment
- **Production**: Deploys to production environment

### Deploying to Development

```bash
npx sst deploy --stage dev
```

### Deploying to Production

```bash
npx sst deploy --stage prod
```

## Domain Configuration

The project uses the following domains:

- Platform: `chainhook.org`
- API: `api.chainhook.org`
- Auth: `auth.chainhook.org`
- Helius: `helius.chainhook.org`

For local development, these are prefixed with the stage name (e.g., `dev.chainhook.org`).

To set up domains:

1. Add the domain to your AWS Route 53 account
2. Configure the domain in the SST config
3. Deploy the infrastructure

## Available Scripts

- `npm run db`: Run drizzle-kit commands
- `npm run seed`: Run database seed
- `npm run dev:tunnel`: Create a tunnel to the database
- `npm run dev:db`: Run drizzle-kit commands in dev stage
- `npm run dev:seed`: Run database seed in dev stage
- `npm run dev:studio`: Open Drizzle Studio in dev stage

## Architecture

The project follows a serverless architecture:

1. **Webhook Management**

   - Single webhook endpoint for Helius events
   - Event router for payload distribution
   - Event filtering based on subscriptions

2. **User Database**

   - Authentication and user management
   - Encrypted credential storage
   - Index configuration preferences

3. **Schema Management**

   - Predefined schemas for common patterns
   - Dynamic schema generation
   - Version control and migrations

4. **Data Processing**
   - Event validation
   - Data transformation
   - Concurrent database writers
   - Retry mechanisms

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

The GNU General Public License is a free, copyleft license for software and other kinds of works. It guarantees end users the freedom to run, study, share, and modify the software.

Key points of the GPL v3:

- You must disclose the source code when you distribute the software
- You must include the license and copyright notice with all copies
- You must state significant changes made to the code
- You must include the original copyright notice
- You must include a copy of the GPL v3 license

For more information, visit [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html).
