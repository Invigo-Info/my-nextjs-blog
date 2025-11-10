# Admin Dashboard with Supabase

A comprehensive admin dashboard for managing user signups and data with Supabase integration.

## Features

### 🔐 Authentication & Security
- Secure admin authentication with Supabase Auth
- Protected admin routes with middleware
- Row Level Security (RLS) policies
- Admin-only access control

### 📊 Dashboard Features
- **Real-time Statistics**
  - Total users count
  - Active users count
  - New users this month

- **User Management**
  - View all registered users
  - Search by email or name
  - Filter by status (Active/Inactive)
  - Sort by email, name, or creation date
  - Pagination for large datasets
  - Activate/Deactivate users
  - Delete users

### 🎨 User Interface
- Clean, modern design with Tailwind CSS
- Responsive layout for all screen sizes
- Loading states and error handling
- Interactive data table
- Real-time data updates

## Setup Instructions

### 1. Install Dependencies

The required dependencies are already installed:
- `@supabase/supabase-js` - Supabase JavaScript client
- `@supabase/ssr` - Server-side rendering support

### 2. Configure Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project credentials from **Project Settings > API**
3. Update `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
ADMIN_EMAIL=your-admin-email@example.com
```

### 3. Set Up Database

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/20250110_create_users_table.sql`
4. Execute the SQL script

This will create:
- `users` table with proper schema
- Row Level Security policies
- Indexes for performance
- Triggers for automatic timestamp updates

### 4. Configure Admin User

1. In Supabase Dashboard, go to **Authentication > Users**
2. Click **Add User** and create a user with the email you specified in `ADMIN_EMAIL`
3. Verify the email

### 5. Set Database Configuration

In Supabase SQL Editor, run:

```sql
ALTER DATABASE postgres SET "app.admin_email" TO 'your-admin-email@example.com';
```

Replace `your-admin-email@example.com` with your actual admin email.

## Usage

### Accessing the Dashboard

1. Start the development server:
```bash
npm run dev
```

2. Navigate to: `http://localhost:3000/admin/dashboard`

3. Log in with your admin credentials

### Dashboard Routes

- `/admin/login` - Admin login page
- `/admin/dashboard` - Main admin dashboard
- `/admin/unauthorized` - Shown when non-admin users try to access

### API Endpoints

- `POST /api/auth/signup` - Create new user
  ```json
  {
    "email": "user@example.com",
    "password": "secure-password",
    "full_name": "John Doe"
  }
  ```

- `GET /api/users/stats` - Get user statistics (admin only)

## Features Breakdown

### Search & Filter
- **Search**: Type in the search box to filter users by email or name
- **Filter**: Toggle between All, Active, and Inactive users
- **Sort**: Click column headers to sort by Email, Name, or Created Date

### Pagination
- View 10 users per page
- Navigate through pages with Previous/Next buttons
- Jump to specific pages
- Shows current page range and total count

### User Actions
- **Activate/Deactivate**: Toggle user's active status
- **Delete**: Remove user from the database (with confirmation)

### Statistics
- **Total Users**: All registered users
- **Active Users**: Users with active status
- **New This Month**: Users registered in the current month

## Security Features

### Row Level Security (RLS)
- Users can only read their own data
- Admin can read all users
- Admin can update and delete users
- Anyone can sign up (insert new users)

### Middleware Protection
- All `/admin/*` routes are protected
- Redirects to login if not authenticated
- Checks admin status for all admin pages
- Automatic session refresh

### Service Role Client
- Admin operations use service role key
- Bypasses RLS for admin operations
- Secure server-side only

## Database Schema

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | TEXT | User's email (unique) |
| full_name | TEXT | User's full name |
| created_at | TIMESTAMP | Registration date |
| updated_at | TIMESTAMP | Last update date |
| metadata | JSONB | Additional user data |
| is_active | BOOLEAN | User status |

## File Structure

```
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard page
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   ├── unauthorized/
│   │   │   └── page.tsx          # Unauthorized page
│   │   └── layout.tsx            # Admin layout
│   └── api/
│       ├── auth/
│       │   └── signup/
│       │       └── route.ts      # Signup API
│       └── users/
│           └── stats/
│               └── route.ts      # Stats API
├── components/
│   └── admin/
│       ├── AdminDashboard.tsx    # Main dashboard component
│       └── UsersTable.tsx        # Users table with pagination
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Client-side Supabase
│   │   ├── server.ts             # Server-side Supabase
│   │   └── admin.ts              # Admin Supabase client
│   └── auth.ts                   # Auth utilities
├── supabase/
│   └── migrations/
│       └── 20250110_create_users_table.sql
├── middleware.ts                  # Route protection
├── .env.local                     # Environment variables
└── .env.example                   # Example env file
```

## Troubleshooting

### Cannot Access Dashboard
- Ensure you're logged in with the admin email
- Check that `ADMIN_EMAIL` in `.env.local` matches your user email
- Verify database configuration is set correctly

### Users Not Appearing
- Check that the SQL migration was executed
- Verify RLS policies are enabled
- Check browser console for errors

### Authentication Issues
- Ensure Supabase credentials are correct
- Check that Email provider is enabled in Supabase
- Verify your admin user is created and verified

## Next Steps

You can extend the dashboard with:
- User details modal
- Export users to CSV
- Email user directly
- Bulk operations
- Advanced analytics
- User activity logs
- Role-based access control

## Support

For more information:
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Setup Guide](./SUPABASE_SETUP.md)
