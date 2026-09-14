# Ganesh Festival Finance Manager

React client and Express/Supabase API for managing contributions, expenditures, receipts, and reports.

## Requirements

- Node.js 18 or newer
- A Supabase project

## Configuration

The root `.env` file is used by the server:

```env
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CLIENT_URL=http://localhost:3000
```

Copy the values from Supabase project settings. Keep the service-role key on the server only; do not expose it in the React client or commit it.

Before starting the API, run `server/supabase/schema.sql` in the Supabase SQL Editor.

## Run Locally

Open two terminals from the repository root.

Terminal 1, start the API:

```powershell
cd server
npm install
npm start
```

Terminal 2, start the React client:

```powershell
cd client
npm install
npm start
```

Open http://localhost:3000. The client proxy sends `/api` requests to the API on port 5000.

Check the API directly at http://localhost:5000/api/health. The server will not start until the Supabase credentials are valid and the schema exists.

## Validation

From `client`, run the production build and tests:

```powershell
npm run build
npm test -- --watchAll=false
```

There are no seeded or mock records. New installations start with empty contribution and expenditure lists; add real records through the UI.

## Hosting

Host the `server` and `client` as separate services, or put both behind the same domain.

For the backend service, use:

```text
Root directory: server
Build command: npm install
Start command: npm start
```

Set these backend environment variables in the hosting provider:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CLIENT_URL=https://your-client-domain.example
```

The hosting provider supplies `PORT`; do not remove it from the server configuration.

For a separately hosted client, set this build environment variable:

```env
REACT_APP_API_URL=https://your-api-domain.example/api
```

For local development, leave `REACT_APP_API_URL` unset so the client uses the existing proxy to `http://localhost:5000`.
