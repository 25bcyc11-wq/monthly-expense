# 🚀 Quick Start - Database & Auth

## ⚡ 5-Minute Setup

### Step 1: Create Database Tables
Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Users Table
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories Table  
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
INSERT INTO public.categories (name) VALUES ('Food'), ('Transportation'), ('Entertainment'), ('Utilities'), ('Healthcare'), ('Shopping'), ('Education'), ('Other');

-- Expenses Table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id),
  amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
  date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own expenses" ON public.expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own expenses" ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Step 2: Start Dev Server
```bash
npm run dev
```

### Step 3: Test
- Open http://localhost:5175/
- Sign up with `test@example.com` / `password123`
- Check Console for logs (F12)
- Dashboard should load
- ✅ Done!

---

## 📊 What Happens

### Signup
```
User fills form → signUp() → Creates auth user + DB record → Console logs success
```

### Signin  
```
User fills form → signIn() → Authenticates + Fetches DB record → Dashboard loads
```

### First Login (No DB Record)
```
signIn() → DB record not found → Auto-creates record → Continue normally
```

---

## 🧪 Test Checklist

- [ ] Database tables created
- [ ] Dev server running: `npm run dev`
- [ ] Sign up: Console shows ✅ "User record created" 
- [ ] Signin: Console shows ✅ "User profile retrieved"
- [ ] Dashboard loads with email displayed
- [ ] Add an expense (should save)
- [ ] Refresh page (should stay logged in)
- [ ] Logout and login again (should work)

---

## 📱 Console Log Summary

### Signup Success
```
📥 Signup auth successful
📤 Creating user record in DB...
📥 User record created successfully
```

### Signin Success
```
📥 Signin response received
📤 Fetching user profile from DB...
📥 User profile retrieved
✅ Sign in successful
```

### First Signin (Auto-Create)
```
📤 Fetching user profile from DB...
⚠️ User profile not found in DB, creating it...
🟢 User record created on first signin
```

---

## 🔴 Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "relation 'users' does not exist" | Table not created | Run SQL setup above |
| No console logs | Page not refreshed | Refresh browser (Ctrl+F5) |
| Auth works, no data | DB insert failed | Check if record exists in Supabase |
| "Duplicate key" | User exists | Normal - app handles it |

---

## 📚 Full Documentation

- **[DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)** - Complete SQL setup + explanations
- **[DATABASE_INTEGRATION.md](DATABASE_INTEGRATION.md)** - How DB functions work + testing details
- **[DATABASE_FIX_COMPLETE.md](DATABASE_FIX_COMPLETE.md)** - Full technical overview
- **[AUTHENTICATION_FIXES.md](AUTHENTICATION_FIXES.md)** - Auth system details

---

## 🎯 Functions in supabase.ts

### Auth Functions (Updated)
- `signUp(email, password)` ← Creates auth + DB record
- `signIn(email, password)` ← Auth + fetches/creates profile

### Profile Functions (New)
- `createUserRecord(userId, email)` ← Insert user to DB
- `getUserProfile(userId)` ← Fetch user from DB
- `getCurrentUserProfile()` ← Get current auth user's profile

---

## ✅ Ready to Go!

Your app now has:
✅ User signup with DB storage
✅ User signin with profile retrieval
✅ Auto-create user records on first login
✅ Detailed console logging
✅ Proper error handling
✅ Production-ready code

**Start testing!** 🚀
