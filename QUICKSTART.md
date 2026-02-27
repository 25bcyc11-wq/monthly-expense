# Quick Start Guide

Get the Expense Tracker up and running in 5 minutes!

## Prerequisites

- Node.js 16+ ([Download](https://nodejs.org/))
- npm or yarn package manager
- A Supabase account (free at [supabase.com](https://supabase.com))

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

Follow the detailed guide in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for complete instructions.

**Quick version:**
1. Create a Supabase project
2. Get your API URL and Anon Key from Settings → API
3. Create tables using the SQL provided in SUPABASE_SETUP.md
4. Insert default categories

### 3. Configure Environment Variables

Create `.env.local` in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## First Time Using the App

1. **Sign Up**
   - Enter an email and password
   - Click "Sign Up"
   - You'll see a confirmation message

2. **Sign In**
   - Enter your credentials
   - Click "Sign In"
   - You'll be logged in automatically

3. **Add Your First Expense**
   - Click the "+" button in the bottom right
   - Fill in the amount, category, and date
   - (note field was part of earlier version and is no longer available in the UI)
   - Click "Add Expense"

4. **View & Filter**
   - See all expenses in the list
   - Filter by category or month using the filter bar
   - View monthly total in the stats card

5. **Delete an Expense**
   - Click "Delete" on any expense card
   - Confirm the deletion

## Available Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter (if configured)
npm run lint
```

## Project Structure

```
src/
├── components/      # React components
├── lib/            # Utilities and Supabase client
├── types/          # TypeScript definitions
├── App.tsx         # Main app component
├── main.tsx        # Entry point
└── index.css       # Global styles
```

## Key Features

✨ **Authentication**
- Sign up with email
- Secure login
- Logout functionality

💰 **Expense Tracking**
- Add expenses with details
- Categorize expenses
- View expense history
- Delete expenses

📊 **Dashboard**
- Monthly total calculation
- Expense counter
- Filterable expense list

🎨 **UI/UX**
- Clean, modern design
- Responsive layout
- Intuitive controls
- Loading states

## Component Overview

| Component | Purpose |
|-----------|---------|
| Auth | Login/Sign-up screen |
| Navbar | Header with logout |
| StatsCard | Display metrics |
| ExpenseCard | Individual expense display |
| AddExpenseModal | Add expense form |
| FilterBar | Filter controls |

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173 or use different port
npm run dev -- --port 3000
```

### Environment Variables Not Loading
- Make sure `.env.local` exists in root
- Restart dev server after changes
- Variables must start with `VITE_`

### Supabase Connection Error
- Verify URL and key in `.env.local`
- Check internet connection
- Ensure Supabase project is active

### Can't Sign Up
- Check email format
- Verify password is at least 6 characters
- Check Supabase Auth settings

## Next Steps

1. **Customize Styling**
   - Edit `tailwind.config.js` for colors
   - Modify component styles
   - Add your branding

2. **Deploy**
   - Build: `npm run build`
   - Deploy `dist/` folder to Netlify, Vercel, or similar
   - Set environment variables in hosting provider

3. **Add Features**
   - Monthly/yearly reports
   - Budget limits
   - Email notifications
   - Export to CSV

4. **Optimize**
   - Add testing
   - Set up CI/CD
   - Monitor performance
   - Add analytics

## Deployment Options

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy!

### Netlify
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Set environment variables
4. Configure redirects for SPA

### Traditional Hosting
1. Build: `npm run build`
2. Upload `dist/` to server
3. Point domain to server
4. Set environment variables

## Tips & Best Practices

✅ **Do's**
- Keep API keys in environment variables
- Use HTTPS in production
- Regular backups of data
- Monitor database usage
- Test before deploying

❌ **Don'ts**
- Don't commit `.env` files
- Don't expose API keys
- Don't skip RLS setup
- Don't ignore build warnings
- Don't mix data across users

## Performance Tips

- Expenses are fetched once on app load
- Filtering happens on the client
- Use browser DevTools to profile
- Monitor Supabase real-time usage

## Security

🔒 **Implemented**
- User authentication
- Secure API keys
- User-based data isolation
- Environment variables

⚠️ **Recommended**
- Enable HTTPS
- Set up firewall rules
- Regular security updates
- Monitor access logs

## Getting Help

1. **Check Documentation**
   - README.md - Full documentation
   - SUPABASE_SETUP.md - Database setup
   - Supabase Docs - Official docs

2. **Debug**
   - Check browser console for errors
   - Use React DevTools
   - Check Supabase logs
   - Verify environment variables

3. **Community**
   - Supabase Discord
   - React Documentation
   - Stack Overflow

## Example Workflow

```
1. npm install
2. Create Supabase project
3. Add API keys to .env.local
4. npm run dev
5. Visit http://localhost:5173
6. Sign up → Add expenses → View dashboard
7. Build & deploy when ready
```

## FAQ

**Q: How do I change the primary color?**
A: Edit `tailwind.config.js` and change the emerald color.

**Q: Can I add recurring expenses?**
A: Not yet, but you can implement this feature!

**Q: Is there a mobile app?**
A: Not yet, but the web app is responsive and mobile-friendly.

**Q: Can I export expenses?**
A: Not in v1, but this is planned for v2.

**Q: How do I backup my data?**
A: Supabase has automatic backups. You can download them from the dashboard.

**Q: Can multiple users use the same account?**
A: Each user needs their own account for data security.

---

**Happy tracking!** 💰

For more detailed information, see [README.md](./README.md)
