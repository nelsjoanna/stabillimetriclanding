# StabiliMetric Pro

## Overview

StabiliMetric Pro is a B2B SaaS landing page for a predictive cosmetic formulation platform. The application targets beauty industry professionals, offering AI-powered ingredient compatibility testing, regulatory compliance automation (MoCRA/FDA/EU), and sustainable beauty formulation tools. The current focus is on waitlist signups for early access partners.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a component-based architecture with:
- Landing page sections as separate components (Hero, Features, Benefits, etc.)
- Reusable UI components from shadcn/ui (Radix UI primitives)
- Path aliases configured for clean imports (`@/` for client source, `@shared/` for shared code)

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript compiled with tsx
- **API Style**: RESTful JSON endpoints under `/api`
- **Development**: Vite dev server with HMR proxied through Express

The server handles:
- Waitlist signup endpoint (`POST /api/waitlist`)
- Static file serving in production
- Request logging middleware

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Validation**: Zod schemas auto-generated from Drizzle schemas via `drizzle-zod`
- **Current Storage**: In-memory storage class (`MemStorage`) with interface for future database migration

Database tables defined:
- `users` - Basic user accounts
- `waitlist_signups` - Early access signups with company info

### Build Process
- Client: Vite bundles React app to `dist/public`
- Server: esbuild compiles TypeScript to `dist/index.cjs`
- Dependencies are selectively bundled to optimize cold start times

## External Dependencies

### UI Component Libraries
- **shadcn/ui**: Full component suite (accordion, dialog, forms, etc.)
- **Radix UI**: Underlying accessible primitives
- **Lucide React**: Icon library
- **react-icons**: Additional icons (social media)

### Database & Validation
- **PostgreSQL**: Primary database (via `DATABASE_URL` environment variable)
- **Drizzle ORM**: Type-safe database queries and migrations
- **Zod**: Runtime validation for API requests

### Development Tools
- **Vite**: Development server and bundler
- **Replit plugins**: Dev banner, cartographer, runtime error overlay

### Fonts
- Google Fonts: DM Sans, Inter, Fira Code, Geist Mono, Architects Daughter (loaded via CDN in HTML)