# 🗄️ Database Setup - SQL Schema

## Required Tables

Run the following SQL commands in Supabase to set up the database for the application.

---

## 1. Users Table

**Purpose:** Store user profile data

```sql
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own data
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Allow users to insert their profile during signup
CREATE POLICY "Users can insert their own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Index for faster queries
CREATE INDEX idx_users_email ON public.users(email);
```

---

## 2. Categories Table

**Purpose:** Store expense categories (shared across all users)

```sql
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (everyone can read, only admins can write)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Everyone can view categories
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (true);

-- Index for faster queries
CREATE INDEX idx_categories_name ON public.categories(name);

-- Insert default categories
INSERT INTO public.categories (name) VALUES
  ('Food'),
  ('Transportation'),
  ('Entertainment'),
  ('Utilities'),
  ('Healthcare'),
  ('Shopping'),
  ('Education'),
  ('Other')
ON CONFLICT DO NOTHING;
```

---

## 3. Expenses Table

**Purpose:** Store expense records for each user

```sql
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Users can only view their own expenses
CREATE POLICY "Users can view their own expenses"
  ON public.expenses FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own expenses
CREATE POLICY "Users can insert their own expenses"
  ON public.expenses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own expenses
CREATE POLICY "Users can update their own expenses"
  ON public.expenses FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only delete their own expenses
CREATE POLICY "Users can delete their own expenses"
  ON public.expenses FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for faster queries
CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX idx_expenses_category_id ON public.expenses(category_id);
CREATE INDEX idx_expenses_date ON public.expenses(date);
CREATE INDEX idx_expenses_user_date ON public.expenses(user_id, date);
```

---

## Step-by-Step Setup

### 1. Open Supabase Dashboard
Go to https://app.supabase.com and select your project

### 2. Open SQL Editor
Navigate to **SQL Editor** in the left sidebar

### 3. Create Users Table
- Click **New Query**
- Paste the Users Table SQL (copy code from section 1 above)
- Click **Run**
- You should see: "Query successful"

### 4. Create Categories Table
- Click **New Query**
- Paste the Categories Table SQL (copy code from section 2 above)
- Click **Run**
- You should see: "Query successful" and 8 categories inserted

### 5. Create Expenses Table
- Click **New Query**
- Paste the Expenses Table SQL (copy code from section 3 above)
- Click **Run**
- You should see: "Query successful"

### 6. Verify Setup
- Go to **Table Editor** in the left sidebar
- You should see 3 tables:
  - ✅ `public.users`
  - ✅ `public.categories` (with 8 default categories)
  - ✅ `public.expenses`

---

## Verification Queries

### Check Users Table
```sql
SELECT * FROM public.users;
```
Should be empty initially (will populate after first signup)

### Check Categories Table
```sql
SELECT * FROM public.categories;
```
Should show 8 default categories

### Check Expenses Table
```sql
SELECT * FROM public.expenses;
```
Should be empty initially (will populate after adding expenses)

### Check Row Level Security
```sql
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' AND tablename IN ('users', 'categories', 'expenses');
```
Should show 3 tables

---

## Security Features

### Row Level Security (RLS) ✅
- Users can only see their own data
- Prevents viewing other users' expenses
- Policies defined in SQL above

### Foreign Keys ✅
- `expenses.user_id` → `users.id` (with cascade delete)
- `expenses.category_id` → `categories.id`
- Ensures data integrity

### Indexes ✅
- Fast queries on commonly filtered columns
- Improves performance for large datasets

### Constraints ✅
- Amount must be > 0
- Email must be unique
- Proper timestamps for audit trail

---

## Connection from App

The app connects using:
- **URL**: From .env `VITE_SUPABASE_URL`
- **Key**: From .env `VITE_SUPABASE_ANON_KEY`
- **RLS**: Uses `auth.uid()` to enforce security

---

## Troubleshooting

### Error: "Permission denied"
- Check RLS policies are correctly set
- Verify `VITE_SUPABASE_ANON_KEY` is the anon key (not secret)

### Error: "Table does not exist"
- Run the SQL setup again
- Check the table exists in Table Editor

### Error: "Foreign key constraint"
- Make sure categories exist before adding expenses
- Check user_id exists when creating expenses

### Error: "Duplicate key"
- User already exists in database
- This is normal on retry - the app handles it

---

## Optional: Reset Database

To completely reset and start fresh:

```sql
-- Drop tables in order (respecting foreign keys)
DROP TABLE IF EXISTS public.expenses CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
```

Then re-run the setup SQL above.

---

## Performance Tips

### Query Optimization
- ✅ Indexes on `user_id`, `date`, `category_id`
- ✅ Compound index on `(user_id, date)` for filtering
- ✅ Email indexed for login lookups

### Pagination (Future Enhancement)
For large expense lists, consider pagination:
```sql
SELECT * FROM public.expenses 
WHERE user_id = '...' 
ORDER BY date DESC 
LIMIT 50 OFFSET 0;
```

### Monthly Reports (Future Enhancement)
```sql
SELECT 
  DATE_TRUNC('month', date) as month,
  category_id,
  SUM(amount) as total
FROM public.expenses
WHERE user_id = '...'
GROUP BY DATE_TRUNC('month', date), category_id;
```

---

## Backup & Restore

### Automatic Backups
Supabase automatically backs up your data. Check:
- **Settings** → **Backup** in Supabase dashboard

### Manual Export
To export data:
1. Go to **SQL Editor**
2. Run: `SELECT * FROM public.expenses;`
3. Click **Download as CSV**

---

## Support

If you encounter issues:
1. Check [Supabase Docs](https://supabase.com/docs)
2. Review RLS policies in Table Editor
3. Check SQL syntax in SQL Editor
4. Look at app console logs for API errors

Happy database setup! 🎉
