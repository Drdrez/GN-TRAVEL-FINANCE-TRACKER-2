# GN Travel Marketing LLC - Finance Tracker

A comprehensive finance tracking application for GN Travel Marketing LLC with a Vercel backend and KV storage.

## Features

- **Dashboard**: Overview of income, expenses, net income, and profit margins
- **Income Tracker**: Track client payments with service types, pricing models, and payment status
- **Expenses Tracker**: Monitor business expenses by category, vendor, and payment method
- **Cash Overview**: Track cash account balances and monthly cash movement
- **Export**: Export data to CSV format
- **Invoice Generation**: Generate printable invoices from income entries
- **Currency Toggle**: Switch between PHP and USD display
- **Auto-Save**: All changes are automatically saved to the cloud

## Tech Stack

- Frontend: HTML, Tailwind CSS, Chart.js
- Backend: Vercel Serverless Functions (Node.js)
- Database: Vercel KV (Redis)

## Deployment to Vercel

### Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/docs/cli) installed (optional, for local development)

### Step 1: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard (Recommended)

1. Push this project to a GitHub/GitLab/Bitbucket repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New" → "Project"
4. Import your repository
5. Vercel will auto-detect the configuration
6. Click "Deploy"

#### Option B: Deploy via CLI

```bash
# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Step 2: Set Up Vercel KV (Database)

1. Go to your Vercel project dashboard
2. Navigate to "Storage" tab
3. Click "Create Database" → "KV"
4. Give it a name (e.g., `gn-finance-db`)
5. Select the same region as your deployment
6. Click "Create"
7. The KV store will automatically connect to your project

### Step 3: Verify Environment Variables

After creating the KV store, Vercel automatically adds these environment variables:
- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

These are required for the `@vercel/kv` package to work.

### Step 4: Redeploy (if needed)

If you created the KV store after initial deployment:

```bash
vercel --prod
```

Or trigger a redeploy from the Vercel dashboard.

## Local Development

### Prerequisites

- Node.js 18+
- Vercel CLI

### Setup

1. Install dependencies:
```bash
npm install
```

2. Link to your Vercel project (required for KV access):
```bash
vercel link
```

3. Pull environment variables:
```bash
vercel env pull .env.local
```

4. Run development server:
```bash
npm run dev
```

Or:
```bash
vercel dev
```

The app will be available at `http://localhost:3000`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/income` | GET | Get all income records |
| `/api/income` | POST | Add new income record |
| `/api/income` | PUT | Update income record(s) |
| `/api/income?id=xxx` | DELETE | Delete income record |
| `/api/expenses` | GET | Get all expense records |
| `/api/expenses` | POST | Add new expense record |
| `/api/expenses` | PUT | Update expense record(s) |
| `/api/expenses?id=xxx` | DELETE | Delete expense record |
| `/api/cash?type=accounts` | GET | Get cash account balances |
| `/api/cash?type=movement` | GET | Get cash movement data |
| `/api/cash?type=accounts` | POST/PUT | Save cash accounts |
| `/api/cash?type=movement` | POST/PUT | Save cash movement |
| `/api/business` | GET | Get business columns and data |
| `/api/business` | POST | Save business data |

## Data Structure

### Income Record
```json
{
  "id": "unique-id",
  "date": "2026-01-15",
  "clientName": "Client Name",
  "serviceType": "Social Media Management",
  "pricingModel": "Monthly Retainer",
  "gross": 50000,
  "net": 45000,
  "paymentMode": "Bank Transfer",
  "status": "Paid",
  "refId": "INV-001",
  "notes": "Optional notes"
}
```

### Expense Record
```json
{
  "id": "unique-id",
  "date": "2026-01-15",
  "vendor": "Vendor Name",
  "category": "Software / Tools",
  "type": "Fixed",
  "service": "General",
  "amount": 5000,
  "payment": "Card",
  "status": "Paid",
  "recurring": "Yes",
  "notes": "Optional notes"
}
```

## Troubleshooting

### "KV not initialized" error
- Make sure you've created a KV store in your Vercel project
- Ensure the environment variables are properly set
- Redeploy after creating the KV store

### Data not saving
- Check browser console for API errors
- Verify KV store is connected in Vercel dashboard
- Check Vercel function logs for errors

### CORS errors (local development)
- Use `vercel dev` instead of serving files directly
- Make sure you're accessing via `localhost:3000`

## Support

For issues or questions, please contact the development team.

## License

Private - GN Travel Marketing LLC
