# Project File Structure & Overview

Complete guide to all files in the Expense Tracker project.

## Root Configuration Files

```
├── package.json                    # Dependencies and scripts
├── vite.config.ts                 # Vite bundler configuration
├── tsconfig.json                  # TypeScript compiler config
├── tsconfig.node.json             # TypeScript config for Vite
├── tailwind.config.js             # Tailwind CSS configuration
├── postcss.config.js              # PostCSS configuration
├── index.html                     # HTML entry point
├── .env.example                   # Environment variables template
├── .gitignore                     # Git ignore rules
└── README.md                      # Main documentation
```

## Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation |
| `QUICKSTART.md` | Quick setup guide |
| `SUPABASE_SETUP.md` | Database setup instructions |
| `DEVELOPMENT.md` | Development guidelines |
| `PROJECT_STRUCTURE.md` | This file |

## Source Files (`src/`)

### Entry Point
```
src/
├── main.tsx                      # React entry point
├── index.css                     # Global styles
└── App.tsx                       # Main app component
```

### Components (`src/components/`)

| File | Purpose | Props |
|------|---------|-------|
| `Auth.tsx` | Login/signup screen | `onAuthSuccess: () => void` |
| `Navbar.tsx` | Top navigation bar | `userEmail, onLogout` |
| `StatsCard.tsx` | Statistics display card | `title, value, icon, color` |
| `ExpenseCard.tsx` | Individual expense display | `expense, onDelete, isLoading` |
| `AddExpenseModal.tsx` | Add expense form modal | `isOpen, onClose, onSubmit, categories, isLoading` |
| `FilterBar.tsx` | Filter controls | `selectedCategory, selectedMonth, selectedYear, categories, onChange...` |
| `index.ts` | Component exports | - |

### Library (`src/lib/`)

| File | Purpose |
|------|---------|
| `supabase.ts` | Supabase client and API functions |
| `utils.ts` | Utility functions for formatting |

### Types (`src/types/`)

| File | Purpose |
|------|---------|
| `index.ts` | TypeScript type definitions |

### Type Declarations

| File | Purpose |
|------|---------|
| `src/vite-env.d.ts` | Vite and environment type definitions |

## Directory Tree

```
expense-tracker/
├── src/
│   ├── components/
│   │   ├── Auth.tsx
│   │   ├── Navbar.tsx
│   │   ├── StatsCard.tsx
│   │   ├── ExpenseCard.tsx
│   │   ├── AddExpenseModal.tsx
│   │   ├── FilterBar.tsx
│   │   └── index.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── dist/                        (generated on build)
├── node_modules/                (generated after npm install)
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
├── .env.example
├── .gitignore
├── README.md
├── QUICKSTART.md
├── SUPABASE_SETUP.md
├── DEVELOPMENT.md
└── PROJECT_STRUCTURE.md
```

## File Descriptions

### Configuration Files

#### `package.json`
- Lists all dependencies (react, @supabase/supabase-js, tailwindcss)
- Defines npm scripts (dev, build, preview)
- Version and metadata

#### `vite.config.ts`
- Configures Vite bundler
- Sets up React plugin
- Incremental compilation enabled

#### `tsconfig.json`
- TypeScript strict mode enabled
- JSX set to react-jsx
- ES2020 target

#### `tailwind.config.js`
- Scans src files for class names
- Extends theme with custom colors
- Configured PostCSS plugins

#### `postcss.config.js`
- Tailwind CSS plugin
- Autoprefixer plugin

### Entry Point

#### `index.html`
- HTML template for the app
- Single root div for React mounting
- References main.tsx script

#### `src/main.tsx`
- Imports and initializes React
- Mounts App component to DOM
- Imports global CSS

#### `src/App.tsx`
- Very thin wrapper that simply renders `Dashboard`
- Legacy auth logic removed; no user state is tracked

### Components
The current UI is consolidated into a single `Dashboard` component located at `src/components/Dashboard.tsx`. It handles form entry, summary display, monthly expense graph, and record list.

*Several legacy components remain in `src/components` (e.g. `Auth`, `Navbar`, `ExpenseCard`, etc.) but they are not used by the app and can be deleted if cleanup is desired.*

(Documentation for those components has been removed because they are no longer relevant.)

### Libraries

#### `src/lib/supabase.ts`
- Supabase client initialization
- Authentication functions:
  - `signUp(email, password)`
  - `signIn(email, password)`
  - `signOut()`
  - `getCurrentUser()`
- Expense functions:
  - `fetchExpenses(userId)`
  - `fetchExpensesByMonth(userId, year, month)`
  - `insertExpense(...)`
  - `deleteExpense(expenseId)`
  - `updateExpense(...)`
- Category functions:
  - `fetchCategories()`

#### `src/lib/utils.ts`
- `formatCurrency(amount)` - Formats number as USD
- `formatDate(date)` - Formats date string
- `formatDateInput(date)` - Formats date for input[type="date"]
- `getMonthName(month)` - Gets month name string

### Types

#### `src/types/index.ts`
- `User` interface
- `Category` interface
- `Expense` interface
- `ExpenseWithCategory` interface

## Build Output

The `npm run build` command generates a `dist/` folder:

```
dist/
├── index.html              # Minified HTML
├── assets/
│   ├── index-*.css         # Minified Tailwind CSS
│   └── index-*.js          # Minified React + app code
└── vite.svg                # Logo asset
```

## Development vs Production

### Development (`npm run dev`)
- Source maps for debugging
- Hot module replacement (HMR)
- Vue error overlay
- Slower, larger bundle

### Production (`npm run build`)
- Minified code
- Tree-shaking (unused code removed)
- Split into chunks
- Optimized for performance
- Ready for deployment

## Code Statistics

| Metric | Value |
|--------|-------|
| Components | 6 |
| Library files | 2 |
| Configuration files | 6 |
| Documentation files | 4 |
| Total lines of code | ~1500 |
| Bundle size (gzipped) | ~95KB |

## Key Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI library | 18.2.0 |
| Vite | Bundler | 5.0.8 |
| TypeScript | Type safety | 5.2.2 |
| Tailwind CSS | Styling | 3.3.6 |
| Supabase | Backend | 2.38.0 |

## File Import Dependencies

```
App.tsx
├── components (Auth, Navbar, etc)
├── lib/supabase (API calls)
├── lib/utils (formatting)
└── types (TypeScript definitions)

Components
├── lib/supabase (Auth, API calls)
├── lib/utils (formatting)
└── types (TypeScript definitions)
```

## Environment Variables

### Development
- Stored in `.env.local`
- Must start with `VITE_` prefix
- Not in version control

### Production
- Set in hosting provider (Vercel, Netlify, etc)
- Same variables as development
- Loaded at build time

## Git Tracking

### Tracked Files
```
✓ Source code (src/)
✓ Configuration files
✓ Documentation
✓ package.json (not node_modules)
```

### Ignored Files
```
✗ node_modules/
✗ dist/
✗ .env / .env.local
✗ .DS_Store
✗ *.log
✗ .vscode settings (except extensions)
```

## Scripts Quick Reference

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run linter (if configured)
```

## Tips for Modifying

### Adding a New Component
1. Create file in `src/components/YourComponent.tsx`
2. Define interface for props
3. Export from `src/components/index.ts`
4. Import in App.tsx or parent component

### Adding a New Utility Function
1. Add to `src/lib/utils.ts`
2. Export function
3. Import where needed

### Adding a New Type
1. Add interface to `src/types/index.ts`
2. Export type
3. Import in components/files using it

### Styling New Components
1. Use Tailwind classes
2. Follow color palette (emerald primary)
3. Add responsive breakpoints
4. Test on mobile/tablet/desktop

## Performance Tips

- All components efficiently rendered
- Tailwind CSS tree-shaken
- Vite caches aggressively
- React.memo available for optimization
- useMemo and useCallback patterns implemented

## Security Considerations

- API keys in environment variables
- User data filtered by user_id
- RLS policies on Supabase
- No sensitive data in localStorage
- Input validation on forms

## Future Enhancement Opportunities

- Add testing suite (Jest, React Testing Library)
- Implement custom hooks
- Add Context API for state management
- Create a custom theme provider
- Add error boundary component
- Implement email notifications
- Add monthly report generation
- Create a settings page

---

**Last Updated**: February 26, 2026

For more information, see:
- [README.md](./README.md) - Full documentation
- [QUICKSTART.md](./QUICKSTART.md) - Setup guide
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guidelines
