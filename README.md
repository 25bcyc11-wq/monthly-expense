💰 Simple Personal Expense Tracker

A minimal, full-stack personal expense tracking application built with modern web technologies.
This project is intentionally lightweight — no complex user management, no unnecessary overhead — just efficient expense tracking with a clean UI.

📌 Overview

This repository contains a full-stack expense tracker designed for individual use.
The system operates on a single primary database table: records.

It allows users to:

Add income and expense entries

View transaction history

Delete unwanted records

Monitor total income, expenses, and savings

🏗 Tech Stack
Layer	Technology
Frontend	React 18 + Vite + Tailwind CSS
Backend	Node.js + Express
Database	Supabase (PostgreSQL)
Language	TypeScript

Backend and frontend run concurrently during development.

🗄 Database Schema

Create the records table in your Supabase project:

CREATE TABLE records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT CHECK (type IN ('income','expense')) NOT NULL,
  amount NUMERIC NOT NULL,
  note TEXT,
  date DATE NOT NULL
);

Note: The note column exists in the database but is currently not used by the frontend UI.

🔌 API Endpoints
Method	Endpoint	Description
POST	/add	Add new income/expense record
GET	/all	Fetch all records (newest first)
DELETE	/delete/:id	Delete record by ID
GET	/summary	Get total income, expense & savings
GET	/health	Backend health check
🚀 Getting Started
1️⃣ Install Dependencies
npm install
2️⃣ Configure Environment Variables

Copy .env.example to .env and update:

# Frontend variables (required by Vite)
VITE_API_URL=http://localhost:5173/
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_public_anon_key

# Backend variables
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_public_anon_key
3️⃣ Run Development Server
npm run dev

Or run separately:

npm run start        # Backend
npm run dev:client   # Frontend
4️⃣ Open in Browser
http://localhost:5173
📊 Application Usage

Add income or expense using the form

View summary totals at the top

See transaction history

Delete unwanted entries

The application is intentionally minimal and optimized for simplicity.

📦 Available Scripts
npm run dev        # Start full development environment
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # Run linter
🧩 Core Components
Dashboard

Primary UI component for:

Adding records

Viewing totals

Viewing monthly expense graph

No props required.

AddExpenseModal

Props:

isOpen: boolean

onClose: () => void

onSubmit: (data: ExpenseData) => void

categories: Category[]

isLoading?: boolean

FilterBar

Props:

selectedCategory: string

selectedMonth: number

selectedYear: number

categories: Category[]

onCategoryChange

onMonthChange

onYearChange

🔐 Security & Best Practices
Implemented

Environment variable configuration

Type safety with TypeScript

Input validation

Error handling

Clean architecture separation

Recommended for Production

Enable Supabase Row-Level Security (RLS)

Add backend validation

Implement rate limiting

Enforce HTTPS

Perform security audits

🎨 UI Design System

Primary Color: Emerald (#10b981)

Design Approach: Clean, modern, mobile-first

Components: Cards with rounded corners and soft shadows

Fully responsive layout

🛠 Customization
Add Categories

Open Supabase dashboard

Insert into categories table

Changes reflect automatically in UI

Change Theme Color

Update tailwind.config.js:

theme: {
  extend: {
    colors: {
      primary: '#your-color-hex',
    },
  },
}
📈 Future Enhancements (Roadmap)

Export to CSV/PDF

Budget tracking

Recurring expenses

Charts & analytics

Multi-currency support

Dark mode

Mobile app (React Native)

🧪 Troubleshooting
Environment Variables Not Loading

Ensure .env exists in root

Use VITE_ prefix for frontend

Restart dev server

Supabase Connection Issues

Verify Supabase URL & Key

Ensure project is active

Check internet connection

Authentication Errors

Clear browser cache

Verify Supabase Auth settings

🤝 Contributing

Contributions are welcome.
Fork the repository and submit a pull request.

📄 License

MIT License — free for personal and commercial use.

📬 Support

For issues:

Check existing GitHub issues

Create a detailed issue

Include logs and environment details

✨ Author

Developed as a full-stack learning project using modern React and Supabase architecture.

