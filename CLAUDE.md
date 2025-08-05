# Claude Code Configuration

This file contains project-specific information for Claude Code to help with development tasks.

## Project Overview

This is a Next.js portfolio website with multiple features:
- Personal portfolio/homepage
- Chat interface with AI assistant
- News translation feature
- Dictionary/pronunciation tools
- Storybook integration for component development

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS
- **Database**: Prisma with PostgreSQL
- **UI Components**: shadcn/ui
- **Development**: TypeScript, Storybook
- **Deployment**: Vercel

## Common Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Storybook
npm run storybook    # Start Storybook dev server
npm run build-storybook  # Build Storybook static files

# Database
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
npx prisma studio    # Open Prisma Studio
```

## Project Structure

- `/app` - Next.js app directory with routes and pages
- `/components` - Reusable UI components
- `/lib` - Utility functions and configurations
- `/prisma` - Database schema and migrations
- `/stories` - Storybook stories for components
- `/patches` - Package patches (notably KaTeX)

## Important Notes

- Storybook static files (`storybook-static/`) are gitignored
- Uses Chromatic for visual regression testing
- Database operations use Prisma ORM
- Responsive design with mobile-first approach

## Environment Variables

Required environment variables should be set for:
- Database connection (DATABASE_URL)
- Authentication services
- External API keys for news/translation features

## Memories

- Remember to update claude.md whenever you can