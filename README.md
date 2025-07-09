# Fafresh Cultural Fashion

A Next.js e-commerce application for Ethiopian cultural fashion.

## Database Management

This project uses SQLite as the primary database (via Prisma ORM) with Google Sheets as a backup storage.

### Database Setup

1. The SQLite database file is located at `prisma/dev.db`
2. To set up the database for the first time:
   ```bash
   npx prisma migrate dev --name init
   ```

### Running Migrations

When you make changes to the Prisma schema (`prisma/schema.prisma`):

1. Create and apply a migration:
   ```bash
   npx prisma migrate dev --name your_migration_name
   ```

2. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

### Database Tools

- View your data with Prisma Studio:
  ```bash
  npx prisma studio
  ```

### Backup System

- All orders are automatically backed up to Google Sheets
- The backup happens asynchronously after successful database writes
- Check the Google Sheet for a complete order history

## Environment Variables

Create a `.env` file with:

```env
# Database
DATABASE_URL="file:./dev.db"

# Google Sheets (for backup)
GOOGLE_SHEET_ID="your-sheet-id"
GOOGLE_CLIENT_EMAIL="your-client-email"
GOOGLE_PRIVATE_KEY="your-private-key"

# NextAuth.js
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run migrations:
   ```bash
   npx prisma migrate dev
   ```

3. Start the development server:
   ```bash
   npm run dev
   ``` 