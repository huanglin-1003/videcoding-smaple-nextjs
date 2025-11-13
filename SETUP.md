# 📖 Setup Guide for Students

This guide will help you get started with this Next.js project step by step.

## 🎯 Learning Path

Choose your learning path based on what you want to focus on:

### Path 1: Frontend Only (Recommended for Beginners)
**Focus**: Learn React, Next.js, TypeScript, and UI components
**Time**: 5 minutes
**Database**: Not required ❌

### Path 2: Full-Stack
**Focus**: Learn everything including database, API routes, and data persistence
**Time**: 15 minutes
**Database**: Required ✅

---

## 🚀 Path 1: Frontend Only Setup

Perfect if you want to learn:
- React components
- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components

### Step 1: Install Node.js and pnpm

```bash
# Check if Node.js is installed (should be 20.x or higher)
node --version

# Install pnpm globally
npm install -g pnpm

# Verify pnpm installation
pnpm --version
```

### Step 2: Clone and Install

```bash
# Clone the repository
git clone https://github.com/ahwei/videcoding-smaple-nextjs.git
cd videcoding-smaple-nextjs

# Install dependencies (this will auto-generate Prisma Client)
pnpm install
```

### Step 3: Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser!

### What Works Without Database?
✅ All UI components
✅ Page routing
✅ TypeScript features
✅ Tailwind CSS styling
✅ Component exploration

### What Doesn't Work?
❌ Creating/viewing orders
❌ Product listings from database
❌ User authentication

> 💡 **Tip**: This is perfect for learning frontend development. You can focus on building UI components without worrying about backend setup!

---

## 🗄️ Path 2: Full-Stack Setup

### Prerequisites

Same as Path 1, plus choose ONE database option:
- **Option A**: Neon (Free cloud PostgreSQL) - Easiest!
- **Option B**: Docker (Local PostgreSQL)

### Step 1-2: Same as Path 1

Follow Steps 1-2 from Path 1 above.

### Step 3: Choose Your Database

#### Option A: Neon (Recommended for Students)

1. **Sign up for free**: Go to https://neon.tech
2. **Create a new project**: Click "Create Project"
3. **Copy connection string**: It looks like:
   ```
   postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require
   ```

4. **Create `.env.local` file**:
   ```bash
   # In the project root directory
   cp .env.example .env.local
   ```

5. **Edit `.env.local`**: Uncomment and paste your Neon URL:
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/neondb?sslmode=require"
   ```

6. **Initialize database**:
   ```bash
   pnpm prisma:push
   pnpm db:seed
   ```

#### Option B: Docker (Local Setup)

1. **Install Docker Desktop**: Download from https://www.docker.com/products/docker-desktop

2. **Start database**:
   ```bash
   pnpm db:start
   ```

3. **Create `.env.local`**:
   ```bash
   cp .env.example .env.local
   ```

4. **Edit `.env.local`**: Uncomment the Docker option:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/breakfast_delivery?schema=public"
   ```

5. **Initialize database**:
   ```bash
   pnpm prisma:push
   pnpm db:seed
   ```

### Step 4: Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) - now with full database features!

### Verify Database Connection

```bash
# Test database connection
pnpm db:test

# Open Prisma Studio (GUI for viewing database)
pnpm prisma:studio
```

---

## 🛠️ Common Commands

### Development
```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Run production build
pnpm lint         # Check code quality
```

### Database (Only needed for Path 2)
```bash
pnpm prisma:studio        # Open database GUI
pnpm prisma:push          # Update database schema
pnpm db:seed              # Add sample data
pnpm db:test              # Test connection
```

### Docker (Only needed for Option B)
```bash
pnpm db:start             # Start containers
pnpm db:stop              # Stop containers
pnpm db:logs              # View logs
```

---

## 🎓 Next Steps

### After Setup - What to Learn?

1. **Explore the Code**:
   - `app/page.tsx` - Home page
   - `components/ui/` - UI components
   - `prisma/schema.prisma` - Database schema

2. **Try These Exercises**:
   - Add a new button to the home page
   - Create a new page route
   - Modify the Tailwind theme colors
   - Add a new shadcn/ui component

3. **Read the Documentation**:
   - [Next.js Docs](https://nextjs.org/docs)
   - [Prisma Docs](https://www.prisma.io/docs)
   - [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## ❓ Troubleshooting

### Problem: `pnpm: command not found`
**Solution**: Install pnpm globally:
```bash
npm install -g pnpm
```

### Problem: Port 3000 is already in use
**Solution**: Use a different port:
```bash
pnpm dev -- -p 3001
```

### Problem: Build fails with "PrismaClient not found"
**Solution**: Reinstall dependencies:
```bash
pnpm install
```

### Problem: Database connection fails
**Solution for Neon**:
- Check your connection string in `.env.local`
- Make sure you copied the entire URL including `?sslmode=require`

**Solution for Docker**:
- Make sure Docker Desktop is running
- Run: `pnpm db:start`
- Wait 10 seconds, then try again

### Problem: Module not found errors
**Solution**: Clean install:
```bash
rm -rf node_modules
pnpm install
```

---

## 💬 Getting Help

1. **Check the FAQ** in README.md
2. **Read error messages carefully** - they usually tell you what's wrong
3. **Search on Google** - Copy/paste the error message
4. **Ask your instructor** - Show them the error and what you tried

---

## ✅ Checklist

Before you start coding, make sure:

- [ ] Node.js 20.x or higher is installed
- [ ] pnpm is installed globally
- [ ] Project dependencies are installed (`pnpm install`)
- [ ] Dev server runs successfully (`pnpm dev`)
- [ ] You can open http://localhost:3000 in browser

**For Full-Stack (Optional)**:
- [ ] Database is set up (Neon or Docker)
- [ ] `.env.local` file exists with `DATABASE_URL`
- [ ] Database is initialized (`pnpm prisma:push`)
- [ ] Sample data is seeded (`pnpm db:seed`)
- [ ] Database connection test passes (`pnpm db:test`)

---

**Happy Learning!** 🎉

Need help? Refer back to this guide or check the main [README.md](./README.md).
