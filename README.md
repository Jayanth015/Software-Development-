# Buyer Lead Intake App

A comprehensive Next.js application for managing buyer leads with full CRUD operations, CSV import/export, and advanced filtering capabilities.

## Features

- **Lead Management**: Create, read, update, and delete buyer leads
- **Advanced Filtering**: Filter by city, property type, status, timeline, and search by name/email/phone
- **CSV Import/Export**: Bulk import leads with validation and export filtered results
- **Change History**: Track all changes made to buyer records
- **Real-time Validation**: Client and server-side validation using Zod
- **Rate Limiting**: Protection against abuse with configurable rate limits
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod
- **Forms**: React Hook Form with Zod resolver
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd buyer-lead-intake
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/buyer_leads"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   NODE_ENV="development"
   ```

4. **Database Setup**
   ```bash
   # Generate migration files
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   
   # (Optional) Open Drizzle Studio to view data
   npm run db:studio
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

### Buyers Table
- `id` (UUID, Primary Key)
- `full_name` (VARCHAR, 2-80 chars, required)
- `email` (VARCHAR, optional)
- `phone` (VARCHAR, 10-15 digits, required)
- `city` (ENUM: Chandigarh, Mohali, Zirakpur, Panchkula, Other)
- `property_type` (ENUM: Apartment, Villa, Plot, Office, Retail)
- `bhk` (ENUM: 1, 2, 3, 4, Studio, required for Apartment/Villa)
- `purpose` (ENUM: Buy, Rent)
- `budget_min` (INTEGER, optional)
- `budget_max` (INTEGER, optional, must be >= budget_min)
- `timeline` (ENUM: 0-3m, 3-6m, >6m, Exploring)
- `source` (ENUM: Website, Referral, Walk-in, Call, Other)
- `status` (ENUM: New, Qualified, Contacted, Visited, Negotiation, Converted, Dropped)
- `notes` (TEXT, optional, max 1000 chars)
- `tags` (JSON array, optional)
- `owner_id` (UUID, Foreign Key to users)
- `updated_at` (TIMESTAMP)

### Buyer History Table
- `id` (UUID, Primary Key)
- `buyer_id` (UUID, Foreign Key)
- `changed_by` (UUID, Foreign Key to users)
- `changed_at` (TIMESTAMP)
- `diff` (JSON, contains field changes)

## API Endpoints

### Buyers
- `GET /api/buyers` - List buyers with filtering and pagination
- `POST /api/buyers` - Create a new buyer
- `GET /api/buyers/[id]` - Get buyer details
- `PUT /api/buyers/[id]` - Update buyer
- `DELETE /api/buyers/[id]` - Delete buyer
- `GET /api/buyers/[id]/history` - Get buyer change history

### Import/Export
- `POST /api/buyers/import` - Import buyers from CSV
- `GET /api/buyers/export` - Export buyers to CSV

## Validation Rules

### Client & Server Validation
- **Full Name**: 2-80 characters, required
- **Phone**: 10-15 digits, required
- **Email**: Valid email format, optional
- **BHK**: Required for Apartment and Villa properties
- **Budget**: Max must be >= Min when both present
- **Notes**: Maximum 1000 characters

### CSV Import
- Maximum 200 rows per import
- All validation rules apply
- Invalid rows are reported with specific error messages
- Only valid rows are imported in a transaction

## Rate Limiting

- **Create Operations**: 20 requests per 15 minutes per IP
- **Other Operations**: 100 requests per 15 minutes per IP
- Rate limit headers included in responses

## Testing

Run the test suite:
```bash
npm test
```

Tests include:
- Validation schema tests
- Budget constraint validation
- Phone number format validation
- CSV parsing tests

## Design Decisions

### Validation Strategy
- **Client-side**: Immediate feedback using React Hook Form + Zod
- **Server-side**: Same Zod schemas ensure consistency
- **CSV Import**: Row-by-row validation with detailed error reporting

### Data Management
- **SSR**: Server-side rendering for better SEO and performance
- **Pagination**: Real pagination with URL-synced parameters
- **Filtering**: URL-synced filters for bookmarkable states
- **Search**: Debounced search for better performance

### Ownership & Security
- **Authentication**: Simple demo auth (replace with NextAuth.js in production)
- **Ownership**: Users can only edit/delete their own buyers
- **Rate Limiting**: Prevents abuse of create/update endpoints

### Concurrency Handling
- **Optimistic Updates**: Form shows changes immediately
- **Conflict Detection**: UpdatedAt timestamps prevent overwrites
- **User Feedback**: Clear error messages for conflicts

## What's Implemented

✅ **Core Features**
- Complete CRUD operations for buyers
- Advanced filtering and search
- CSV import/export with validation
- Change history tracking
- Real-time form validation
- Responsive design

✅ **Quality Features**
- Rate limiting
- Error boundaries
- Accessibility basics
- Unit tests
- TypeScript throughout

✅ **Nice-to-Haves**
- Tag support with JSON storage
- Status quick actions
- Optimistic updates
- Comprehensive error handling

## What's Skipped

- **Authentication**: Simple demo auth instead of NextAuth.js
- **File Uploads**: Attachment support not implemented
- **Admin Role**: All users have same permissions
- **Real-time Updates**: No WebSocket implementation
- **Advanced Search**: No full-text search on notes

## Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- Ensure PostgreSQL database is accessible
- Set all required environment variables
- Run database migrations on deployment

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details

