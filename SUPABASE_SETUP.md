# Supabase Setup Guide

This guide will walk you through setting up Supabase for the Expense Tracker application.

## Step 1: Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Sign In" or "Get Started"
3. Sign up with GitHub or email
4. Verify your email

## Step 2: Create a New Project

1. After logging in, click "New Project"
2. Enter project details:
   - **Name**: expense-tracker (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Select closest to your location
3. Click "Create new project"
4. Wait for the project to be created (1-2 minutes)

## Step 3: Get API Keys

1. In your project dashboard, click "Settings" (gear icon)
2. Click "API"
3. Copy the following:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **Anon public** → `VITE_SUPABASE_ANON_KEY`
4. Save these in your `.env.local` file

## Step 4: Create Database Tables

1. Click "SQL Editor" in the left sidebar
2. Click "New Query"
3. Copy and paste the following SQL:

```sql
-- Create users table (if not auto-created)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  category_id UUID NOT NULL REFERENCES public.categories(id),
  date DATE NOT NULL,
  note TEXT,  <!-- legacy field not used by frontend -->
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX idx_expenses_date ON public.expenses(date);
CREATE INDEX idx_expenses_category_id ON public.expenses(category_id);
```

4. Click "Run" (play button)
5. You should see notifications that tables were created

## Step 5: Insert Default Categories

1. Click "New Query"
2. Copy and paste:

```sql
INSERT INTO public.categories (name) VALUES
  ('Food'),
  ('Transport'),
  ('Entertainment'),
  ('Shopping'),
  ('Utilities'),
  ('Health'),
  ('Other')
ON CONFLICT (name) DO NOTHING;
```

3. Click "Run"

## Step 6: Enable Row Level Security (RLS)

Row Level Security ensures users can only access their own data.

1. Click "Authentication" in the left sidebar
2. Click "Policies"
3. For **expenses** table:
   - Click "New Policy"
   - Select "Enable RLS"
   - Create policy:
     - Name: "Enable select for users based on user_id"
     - Type: "SELECT"
     - Expression: `auth.uid() = user_id`
   - Click "Create"
   - Repeat for INSERT and DELETE with appropriate expressions

Alternatively, use this SQL:

```sql
-- Enable RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Expenses policies
CREATE POLICY "Users can select their own expenses"
  ON public.expenses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own expenses"
  ON public.expenses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expenses"
  ON public.expenses
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own expenses"
  ON public.expenses
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Categories policies (allow all authenticated users to read)
CREATE POLICY "Allow authenticated users to read categories"
  ON public.categories
  FOR SELECT
  USING (TRUE);
```

4. Click "Run"

## Step 7: Configure Authentication

1. Go to "Authentication" → "Providers"
2. Email is enabled by default
3. Optional: Enable social login (Google, GitHub, etc.)
4. Go to "URL Configuration"
5. Add your site URLs:
   - Localhost: `http://localhost:5173`
   - Production: `https://yourdomain.com`

## Step 8: Test the Connection

1. Update your `.env.local`:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Start the dev server:
   ```bash
   npm run dev
   ```

3. Try signing up with an email
4. Check if the user appears in Supabase:
   - Go to Authentication → Users
   - You should see your test user

## Step 9: Monitor Your Project

1. **Database Usage**: Go to Settings → Billing
2. **Query Performance**: Use the SQL Editor to test queries
3. **Logs**: Check Auth logs in Authentication → Logs
4. **Connections**: Monitor real-time updates in real-time section

## Troubleshooting

### "Permission denied" errors
- Check Row Level Security policies
- Verify user_id matches auth.uid()
- Check API key permissions

### "Relation does not exist" error
- Ensure all tables are created
- Check table names match exactly (case-sensitive)
- Run SQL queries in SQL Editor

### Can't sign up
- Check email is valid
- Verify SMTP settings in Authentication → Email
- Check firewall isn't blocking requests

### Slow queries
- Add indexes to frequently queried columns
- Check query execution plan
- Consider caching results

## Backup & Recovery

1. Go to Settings → Database
2. Click "Backups"
3. Enable automatic backups
4. Download backups regularly for local storage

## Production Checklist

- [ ] Enable Row Level Security
- [ ] Set up firewall rules
- [ ] Enable backups
- [ ] Configure SMTP for emails
- [ ] Set environment variables
- [ ] Enable HTTPS
- [ ] Monitor database quotas
- [ ] Set up monitoring/logging
- [ ] Create admin user
- [ ] Load test the application

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Real-time](https://supabase.com/docs/guides/realtime)

## Security Best Practices

1. ✅ Always use HTTPS in production
2. ✅ Keep API keys secret
3. ✅ Use Row Level Security
4. ✅ Validate data on client and server
5. ✅ Regular backups
6. ✅ Monitor for suspicious activity
7. ✅ Use strong passwords
8. ✅ Update dependencies regularly
