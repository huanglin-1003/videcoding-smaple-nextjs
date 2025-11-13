# 🍳 Taiwanese Breakfast Delivery App

A modern Next.js full-stack application showcasing a breakfast delivery platform with TypeScript, Tailwind CSS v4, shadcn/ui, and Prisma ORM.

> 📚 **Perfect for Learning**: This project is designed for educational purposes, demonstrating modern web development practices with Next.js 16 and React 19.

## ✨ Features

- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS v4
- ⚡ **Next.js 16**: Using the latest App Router with Server Components
- 🗄️ **Multi-Database Support**: PostgreSQL and SQL Server via Prisma
- 🔒 **Type-Safe**: Full TypeScript support
- 📱 **Responsive**: Mobile-first design
- 🚀 **Production Ready**: Optimized for deployment on Vercel

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.x or higher
- **pnpm** 8.x or higher (recommended) or npm

### Option 1: Local Development (No Database Required)

Perfect for UI development and learning Next.js basics:

```bash
# 1. Clone the repository
git clone https://github.com/ahwei/videcoding-smaple-nextjs.git
cd videcoding-smaple-nextjs

# 2. Install dependencies
pnpm install

# 3. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app!

> ⚠️ **Note**: Without database setup, features requiring data persistence won't work. This is fine for learning the frontend and UI components.

### Option 2: Full Setup (With Database)

For complete functionality including orders, products, and user management:

```bash
# 1. Clone and install (same as above)
git clone https://github.com/ahwei/videcoding-smaple-nextjs.git
cd videcoding-smaple-nextjs
pnpm install

# 2. Set up environment variables
cp .env.example .env.local

# 3. Edit .env.local and add your database connection
# For PostgreSQL:
DATABASE_URL="postgresql://user:password@host:5432/dbname"
# Or use a free Neon database: https://neon.tech

# 4. Initialize the database
pnpm prisma:push
pnpm db:seed

# 5. Start the development server
pnpm dev
```

## 📦 Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **UI Library** | React 19.2 |
| **Styling** | Tailwind CSS v4 |
| **Components** | shadcn/ui + Radix UI |
| **Database ORM** | Prisma 6.19 |
| **Database** | PostgreSQL / SQL Server |
| **Package Manager** | pnpm |

## 📁 Project Structure

```
videcoding-smaple-nextjs/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles & theme
├── components/              # React components
│   └── ui/                  # shadcn/ui components
├── lib/                     # Utilities
│   ├── utils.ts            # Helper functions
│   └── db/                 # Database utilities
│       └── prisma.ts       # Prisma client singleton
├── prisma/                  # Database
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Seed data
├── scripts/                 # Utility scripts
│   └── db/                 # Database management scripts
├── public/                  # Static assets
└── .env.local              # Local environment variables (create this)
```

## 🛠️ Available Scripts

### Development
```bash
pnpm dev          # Start development server (localhost:3000)
pnpm build        # Build for production (auto-generates Prisma Client)
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

### Database
```bash
pnpm prisma:generate      # Generate Prisma Client
pnpm prisma:studio        # Open Prisma Studio (GUI for database)
pnpm prisma:push          # Push schema changes to database
pnpm db:seed              # Seed database with sample data
pnpm db:test              # Test database connection
```

### Docker (Optional)
```bash
pnpm db:start             # Start PostgreSQL + SQL Server in Docker
pnpm db:stop              # Stop database containers
pnpm db:logs              # View database logs
```

## 🗄️ Database Setup Guide

### Option A: Use Neon (Recommended for Beginners)

[Neon](https://neon.tech) provides free PostgreSQL databases:

1. Sign up at https://neon.tech
2. Create a new project
3. Copy the connection string
4. Paste it in `.env.local`:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require"
   ```
5. Run: `pnpm prisma:push && pnpm db:seed`

### Option B: Use Docker (Local)

```bash
# Start PostgreSQL container
pnpm db:start

# Use the default local connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/breakfast_delivery"

# Initialize database
pnpm prisma:push && pnpm db:seed
```

### Option C: Use Vercel Postgres (Production)

1. Connect Postgres storage in Vercel dashboard
2. Environment variables are auto-configured
3. Deploy your app - done!

## 🎨 Working with shadcn/ui

This project uses shadcn/ui for components. To explore components:

```bash
# Components are manually added to components/ui/
# Browse available components: https://ui.shadcn.com

# Example usage:
import { Button } from "@/components/ui/button"

export default function Page() {
  return <Button variant="default">Click me</Button>
}
```

Current components:
- Button

## 🌍 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database Connection (Required for full functionality)
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Optional: Database Provider (for reference)
DATABASE_PROVIDER="postgresql"
```

> 🔒 **Security**: Never commit `.env.local` to Git. It's already in `.gitignore`.

## 🚢 Deployment

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ahwei/videcoding-smaple-nextjs)

#### Manual Deployment:

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables:
   - `DATABASE_URL` - Your production database URL
4. Deploy!

**Important**:
- Set `DATABASE_URL` in Vercel environment variables
- Prisma Client is automatically generated during build
- The `postinstall` hook ensures dependencies are ready

### Deploy to Other Platforms

This app can be deployed to:
- Railway
- Render
- Fly.io
- Any platform supporting Node.js

Just ensure:
1. Set `DATABASE_URL` environment variable
2. Build command: `pnpm build`
3. Start command: `pnpm start`

## 📚 Learning Resources

### For Next.js Beginners
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Next.js App Router Guide](https://nextjs.org/docs/app)

### For TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### For Tailwind CSS
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS v4 Beta](https://tailwindcss.com/blog/tailwindcss-v4-beta)

### For Prisma
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

## 🤝 Contributing

This is an educational project. Feel free to:
- Fork the repository
- Submit issues for bugs or suggestions
- Create pull requests with improvements

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♂️ FAQ

### Q: Do I need a database to run this project?
**A**: No! You can run the app without a database for UI development. Just skip the database setup steps and run `pnpm dev`.

### Q: The build fails with "PrismaClient not found"
**A**: This is automatically fixed! The `postinstall` hook runs `prisma generate` when you install dependencies. If you still see this error, run: `pnpm install`

### Q: Can I use npm instead of pnpm?
**A**: Yes, but pnpm is recommended for faster installs and better disk efficiency. Replace `pnpm` with `npm` in all commands.

### Q: How do I add new database tables?
**A**:
1. Edit `prisma/schema.prisma`
2. Run `pnpm prisma:push`
3. Update `prisma/seed.ts` if needed

### Q: Where do I set environment variables for production?
**A**: In your deployment platform's dashboard (Vercel, Railway, etc.), not in `.env.production` which is now gitignored.

---

Made with ❤️ for learning modern web development

**Happy Coding!** 🚀
