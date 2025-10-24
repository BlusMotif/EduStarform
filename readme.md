# EduStar Consult Study Abroad Questionnaire

# NO EVN FILE, Install all the packages using npm install --all --save 
# Then start the server by runing npm run dev for both frontend and backend 
# No Cd just start the server to run the whole application

## Overview

This is a study abroad questionnaire application for EduStar Consult, designed to collect comprehensive information from prospective students about their educational background, study abroad goals, and preferences. The application provides a multi-step form interface for students to submit their information and an admin dashboard for reviewing submissions. Each submission receives a unique reference number for tracking purposes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Routing**
- React with TypeScript as the primary frontend framework
- Wouter for lightweight client-side routing (no traditional React Router)
- Single-page application with three main routes:
  - `/` - Main questionnaire form
  - `/success` - Submission confirmation page
  - `/admin` - Admin dashboard for viewing submissions

**UI Component System**
- shadcn/ui component library with "new-york" style preset
- Radix UI primitives for accessible, unstyled components
- Custom component architecture with three main organizational patterns:
  - `@/components/ui/*` - Reusable UI primitives (buttons, inputs, cards, etc.)
  - `@/components/*` - Application-specific components (FormHeader, FormSection, ProgressIndicator)
  - `@/pages/*` - Route-level page components

**Design System**
- Tailwind CSS for utility-first styling
- CSS custom properties for theming (HSL color format)
- Material Design foundation with strong EduStar brand customization
- Primary brand color: Purple (270 70% 58% - #7C3AED)
- Responsive design with mobile-first breakpoints
- Dark mode support through CSS class-based theming

**Form Management**
- React Hook Form for form state management and validation
- Zod for runtime schema validation
- @hookform/resolvers for integrating Zod with React Hook Form
- Multi-step form pattern with progress indicator
- Client-side validation before submission

**State Management**
- TanStack Query (React Query) for server state management
- Local component state with React hooks
- No global state management library (Redux/MobX) - keeps architecture simple

### Backend Architecture

**Server Framework**
- Express.js as the HTTP server
- TypeScript for type safety across the stack
- ESM module system (not CommonJS)

**API Design**
- RESTful API endpoints:
  - `POST /api/submissions` - Create new questionnaire submission
  - `GET /api/submissions` - Retrieve all submissions (admin)
  - `GET /api/submissions/:referenceNumber` - Retrieve specific submission by reference
- JSON request/response format
- Centralized error handling with appropriate HTTP status codes
- Request logging middleware for API routes

**Data Validation**
- Shared schema validation between client and server using Zod
- Schema defined in `shared/schema.ts` for consistency
- Server-side validation using the same schemas as client
- Friendly error messages using zod-validation-error

**Reference Number Generation**
- Custom reference number format: `EDU-XXXXXX`
- Generated using nanoid with custom alphabet (uppercase letters and numbers)
- 6-character unique identifier ensures collision resistance

**Development & Production**
- Vite development server with HMR (Hot Module Replacement)
- Custom Vite middleware integration for development
- Production build separates frontend (Vite) and backend (esbuild)
- Static file serving in production mode

### Data Storage

**Database**
- MongoDB

**Data Model**
- Single `submissions` table storing all questionnaire data
- Fields organized by form sections:
  - Personal details (name, DOB, contact, nationality, passport)
  - Educational background (institution, field of study, graduation year)
  - Study abroad journey (preferences, program type, funding)
  - Challenges and insights
  - Emergency contact details
  - Language test scores
- JSONB columns for array data (study reasons, challenges)
- UUID primary key with readable reference number for user-facing identifiers
- Automatic timestamp tracking (createdAt)

**Storage Layer Abstraction**
- `IStorage` interface defines data access contract
- `DatabaseStorage` implements the interface
- Separation allows for future storage backend changes without affecting business logic

### External Dependencies

**UI & Component Libraries**
- Radix UI - Comprehensive set of accessible component primitives (accordion, dialog, dropdown, etc.)
- shadcn/ui - Pre-built component library built on Radix UI
- lucide-react - Icon library
- cmdk - Command palette component
- embla-carousel-react - Carousel component
- vaul - Drawer component
- react-day-picker - Calendar/date picker

**Form & Validation**
- react-hook-form - Form state management
- zod - Schema validation
- @hookform/resolvers - Integration layer between react-hook-form and zod
- zod-validation-error - Improved error messages from Zod

**Styling**
- Tailwind CSS - Utility-first CSS framework
- class-variance-authority - Type-safe variant styling
- clsx & tailwind-merge - Utility for conditional class names
- PostCSS with autoprefixer

**Data Fetching**
- @tanstack/react-query - Server state management and caching

**Database**
- @Mongoose MongoDB


**Utilities**
- nanoid - Unique ID generation
- date-fns - Date manipulation and formatting

**Development Tools**
- Vite - Build tool and dev server
- TypeScript - Type checking
- esbuild - Production backend bundling

**Fonts**
- Google Fonts: Inter (primary) and JetBrains Mono (monospace for reference numbers)