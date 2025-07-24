# Portfolio Storage System

## Overview

The portfolio application now uses a **permanent file-based storage system** instead of temporary in-memory data. All created projects are now persisted to disk and will survive server restarts.

## Storage Implementation

### File-Based Storage
- **Location**: `data/portfolio.json`
- **Format**: JSON file containing array of portfolio entries
- **Persistence**: Data survives server restarts and deployments
- **Backup**: File can be easily backed up and restored

### Storage Functions
Located in `lib/storage/portfolio-storage.ts`:

- `getAllPortfolioEntries()` - Retrieve all portfolio entries
- `createPortfolioEntry(data)` - Create new portfolio entry
- `getPortfolioEntryById(id)` - Get entry by ID
- `getPortfolioEntryBySlug(slug)` - Get entry by slug
- `updatePortfolioEntry(id, data)` - Update existing entry
- `deletePortfolioEntry(id)` - Delete entry

## API Endpoints

### Admin Endpoints (Authentication Required)
- `GET /api/portfolio` - Get all entries (admin only)
- `POST /api/portfolio` - Create new entry (admin only)

### Public Endpoints
- `GET /api/public/portfolio` - Get all entries (public access)

## Data Structure

```typescript
interface PortfolioEntry {
  id: string
  slug: string
  title: string
  description: string
  category?: string
  tags?: string
  completionDate?: string
  images: Array<{
    url: string
    public_id: string
    width: number
    height: number
  }>
  createdAt: string
  updatedAt: string
}
```

## Features

### ✅ Permanent Storage
- Projects are saved to `data/portfolio.json`
- Data persists across server restarts
- No data loss when redeploying

### ✅ Automatic Initialization
- Creates default portfolio entries on first run
- Ensures data directory exists
- Handles missing files gracefully

### ✅ CRUD Operations
- Create new portfolio entries
- Read all entries
- Update existing entries (ready for future features)
- Delete entries (ready for future features)

### ✅ Slug Generation
- Automatic URL-friendly slug generation from titles
- Used for SEO-friendly URLs

## File Structure

```
data/
└── portfolio.json          # Portfolio entries storage

lib/storage/
└── portfolio-storage.ts    # Storage functions

app/api/
├── portfolio/
│   └── route.ts            # Admin API endpoints
└── public/portfolio/
    └── route.ts            # Public API endpoints
```

## Migration from Mock Data

The system has been migrated from in-memory mock data to persistent file storage:

### Before (Temporary)
- Data stored in memory
- Lost on server restart
- Mock data in API route

### After (Permanent)
- Data stored in JSON file
- Persists across restarts
- Real CRUD operations

## Backup and Recovery

### Manual Backup
```bash
# Backup portfolio data
cp data/portfolio.json backup/portfolio-$(date +%Y%m%d).json
```

### Restore from Backup
```bash
# Restore portfolio data
cp backup/portfolio-20240120.json data/portfolio.json
```

## Future Database Migration

This file-based system can be easily migrated to a database:

1. **PostgreSQL/MySQL**: Replace file operations with SQL queries
2. **MongoDB**: Replace with MongoDB operations
3. **Prisma ORM**: Add Prisma schema and replace storage functions

The storage interface remains the same, making migration seamless.

## Development

### Local Development
- Data stored in `data/portfolio.json`
- File is gitignored (not committed to repository)
- Each developer has their own local data

### Production Deployment
- Ensure `data/` directory has write permissions
- Consider database migration for production scale
- Implement proper backup strategy

## Security

- Admin endpoints require authentication
- Public endpoints are read-only
- File permissions should be properly configured
- Input validation through Zod schemas

## Performance

- Suitable for small to medium portfolios (< 1000 entries)
- For larger datasets, consider database migration
- File operations are atomic (read/write entire file)
- Consider caching for high-traffic scenarios
