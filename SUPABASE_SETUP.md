# Supabase Setup Guide for Admin Dashboard

## Prerequisites
1. Create a Supabase project at https://supabase.com
2. Get your project credentials from Project Settings > API

## Step 1: Configure Environment Variables

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_EMAIL=your-admin-email@example.com
```

## Step 2: Run Database Migration

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/20250110_create_users_table.sql`
4. Execute the SQL

## Step 3: Enable Email Authentication (Optional)

If you want users to sign up with email/password:

1. Go to Authentication > Providers in Supabase Dashboard
2. Enable Email provider
3. Configure email templates if needed

## Step 4: Set Admin Email

In Supabase Dashboard:
1. Go to Authentication > Users
2. Create a user with the email specified in ADMIN_EMAIL
3. Verify the email

## Step 5: Configure App Settings

In Supabase Dashboard SQL Editor, run:

```sql
ALTER DATABASE postgres SET "app.admin_email" TO 'your-admin-email@example.com';
```

## Step 6: Test the Setup

1. Run `npm run dev`
2. Navigate to `/admin/dashboard`
3. Sign in with your admin email
4. You should see the admin dashboard

## Database Schema

### Users Table

- `id` (UUID): Primary key
- `email` (TEXT): User's email address (unique)
- `full_name` (TEXT): User's full name
- `created_at` (TIMESTAMP): When the user signed up
- `updated_at` (TIMESTAMP): Last update timestamp
- `metadata` (JSONB): Additional user data
- `is_active` (BOOLEAN): Whether the user is active

## Security

The admin dashboard uses Row Level Security (RLS) policies to ensure:
- Only authenticated admin users can access all user data
- Regular users can only see their own data
- Anyone can sign up (insert new users)
- Only admins can update or delete users
