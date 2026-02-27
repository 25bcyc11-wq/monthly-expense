# 🔐 Supabase Authentication Testing Guide

## ✅ All Fixes Applied

Your Vite + React + Supabase authentication setup has been fixed! Here's what was corrected:

### Changes Made

#### 1. **[src/lib/supabase.ts](src/lib/supabase.ts)** - Enhanced with logging
- ✅ Configuration check on startup (shows if env vars are loaded)
- ✅ Request logging before sending to Supabase
- ✅ Response logging after Supabase replies
- ✅ Error logging with detailed context (status, message)
- ✅ Try-catch blocks for better error handling

#### 2. **[src/components/Auth.tsx](src/components/Auth.tsx)** - Better error handling
- ✅ Console logs for auth request lifecycle
- ✅ Detailed error messages (not just "Authentication failed")
- ✅ Clear distinction between signup and signin
- ✅ Proper error state clearing
- ✅ Success feedback in console

#### 3. **[src/App.tsx](src/App.tsx)** - Fixed auth flow
- ✅ Proper `onAuthSuccess` callback (was empty, now actually fetches user)
- ✅ Auth state checking with logging
- ✅ Auth state change listener with debug info
- ✅ User is fetched and set after successful sign-in

---

## 🧪 How to Test

### Step 1: Start the Dev Server
```bash
npm run dev
```
The server runs on **`localhost:5174`** (or next available port)

### Step 2: Open DevTools
- Press **F12** or **Ctrl+Shift+I** to open DevTools
- Go to **Console** tab for logs
- Go to **Network** tab to watch requests

### Step 3: Test Sign Up
1. Enter email: `test@example.com`
2. Enter password: `password123` (minimum 6 chars)
3. Click **"Sign Up"** button
4. **Check Console** for:
   ```
   🔧 Supabase Configuration: { url: '✅ Present', key: '✅ Present', isDev: true }
   🔄 Auth request started: { type: 'sign-up', email: 'test@example.com', ... }
   📤 Sending signup request... { email: 'test@example.com', url: 'https://yzcugemjnowtzuvivzam.supabase.co' }
   📥 Signup response received: { userId: '...' }
   ✅ Sign up successful: { userId: '...', email: 'test@example.com' }
   ```
5. **Check Network tab** for:
   - Request to `https://yzcugemjnowtzuvivzam.supabase.co/auth/v1/signup`
   - Status: **200** (success) or **400** (validation error)
   - Response shows user object with `id` field

### Step 4: Test Sign In
1. Toggle to **"Sign In"** mode
2. Enter the email/password you just signed up with
3. Click **"Sign In"** button
4. **Check Console** for:
   ```
   🔄 Auth request started: { type: 'sign-in', email: 'test@example.com', ... }
   📤 Sending signin request...
   📥 Signin response received: { userId: '...', session: true }
   ✅ Sign in successful: { userId: '...', email: 'test@example.com' }
   🎉 Auth success callback triggered, checking user...
   ✅ User set after auth: { userId: '...', email: 'test@example.com' }
   ```
5. **Check Network tab** for:
   - Request to `https://yzcugemjnowtzuvivzam.supabase.co/auth/v1/token`
   - Status: **200** (success)
   - Response includes `access_token` and `user` object

### Step 5: Verify App Dashboard Loads
- After successful sign-in, you should see the **Expense Tracker dashboard**
- Console should show:
   ```
   🔍 Checking auth status...
   ✅ User authenticated: { userId: '...', email: 'test@example.com' }
   ```

---

## 🔍 Console Output Examples

### ✅ Success Flow
```
🔧 Supabase Configuration: { url: '✅ Present', key: '✅ Present', isDev: true }
App component mounted { ... }
🔍 Checking auth status...
ℹ️ No user authenticated
🔄 Auth request started: { type: 'sign-in', email: 'mary@example.com', timestamp: '2026-02-26T10:30:45.123Z' }
📤 Sending signin request... { email: 'mary@example.com', url: 'https://yzcugemjnowtzuvivzam.supabase.co' }
📥 Signin response received: { userId: 'abc-123-def', session: true }
✅ Sign in successful: { userId: 'abc-123-def', email: 'mary@example.com' }
🎉 Auth success callback triggered, checking user...
✅ User set after auth: { userId: 'abc-123-def', email: 'mary@example.com' }
🔔 Auth state changed: { event: 'SIGNED_IN', userId: 'abc-123-def' }
```

### ❌ Error Flow (What to Look For)
```
❌ Auth error: {
  error: "Invalid login credentials",
  status: 400,
  type: 'sign-in',
  timestamp: '2026-02-26T10:31:20.456Z'
}
```

---

## 🌐 Network Tab Checklist

When you click Sign In/Sign Up:

| Check | Expected |
|-------|----------|
| **Request URL** | Contains `supabase.co` |
| **Request Method** | POST |
| **Status** | 200 (success) or 400-401 (validation/auth errors) |
| **Request Headers** | Has `Content-Type: application/json` |
| **Response Body** | Contains `user` object with `id` field |
| **Time** | Usually < 1 second (local dev) |

**❌ Common Errors to Fix:**
- **"Failed to fetch"** → Check Network tab for exact status/error
- **CORS issue** → Check error message in Network tab response
- **401/403** → Invalid credentials
- **400** → Validation error (weak password, invalid email)

---

## 🔧 Environment Variables Verification

Your `.env` file is correctly set up:
```
VITE_SUPABASE_URL=https://yzcugemjnowtzuvivzam.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_mK5Vz12Z9UsCoqDPxj1dOQ_2N4U6c8r
```

**Note:** 
- Vite requires `VITE_` prefix for env vars to be accessible in the browser
- These are used via `import.meta.env.VITE_SUPABASE_URL` (not `process.env`)

---

## 📋 Quick Debugging Checklist

- [ ] Dev server running on localhost:5174? (`npm run dev`)
- [ ] DevTools Console open (F12)?
- [ ] See "Supabase Configuration: ✅ Present ✅ Present"?
- [ ] See request logs when clicking buttons?
- [ ] See Network requests in Network tab?
- [ ] No "Failed to fetch" errors?
- [ ] After sign-in, redirected to dashboard?

---

## 🚀 Next Steps

Once testing is successful:
1. Test with actual data (add expenses, categories)
2. Test logout functionality
3. Test page refresh (user should stay logged in)
4. Test filtering and sorting
5. Deploy to production!

---

## 💬 If Something Still Goes Wrong

Check the **Console** error immediately:
- Copy the exact error message
- Note the timestamp
- Check if it says "Failed to fetch" (network issue) or specific auth error
- Look at the **Network tab** request/response for actual error

The detailed logging now makes it much easier to debug!
