# SafeBridge - Accessibility Communication Platform

## Overview

SafeBridge is an accessibility platform designed for persons with disabilities in Bangladesh. The application provides real-time sign language detection and translation using computer vision (MediaPipe), emergency safety systems with SOS gesture recognition, and multi-role dashboards for users, parents/caregivers, and police/emergency responders.

The core features include:
- Real-time hand gesture detection via webcam using MediaPipe HandLandmarker
- Sign language translation for both ASL gestures and Bangla Sign Language (BdSL)
- Emergency SOS system triggered by specific hand gestures
- Role-based dashboards (user, parent, police)
- Comprehensive accessibility settings (high contrast, large text, voice control, screen reader support)
- Caregiver linking and monitoring capabilities
- Video conferencing with sign language support (SafeMeet)
- User settings page for personal information, phone number, location, and parent/caregiver details

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom plugins for meta images and Replit integration
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS v4 with custom theme variables, shadcn/ui component library (New York style)
- **State Management**: React Context API for auth, emergency state, and accessibility settings
- **Data Fetching**: TanStack React Query for server state management
- **Animations**: Framer Motion for UI transitions

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript compiled with tsx
- **API Pattern**: RESTful endpoints under `/api/*`
- **Build Process**: esbuild for server bundling, Vite for client

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains table definitions
- **Tables**: 
  - `profiles`: User profiles with role-based access (user/parent/police), includes settings fields (phoneNumber, location, contactDetails, parentInfo, emergencyContact)
  - `activities`: Activity logging for user actions
- **Migrations**: Drizzle Kit with `db:push` command

### Authentication
- **Provider**: Supabase Auth for user authentication
- **Session Management**: Supabase client-side session handling
- **Role System**: Three roles - user, parent, police with different dashboard views
- **Demo Accounts**: Built-in demo accounts for testing each role

### Computer Vision
- **Library**: MediaPipe Tasks Vision (@mediapipe/tasks-vision)
- **Model**: HandLandmarker for 21-point hand landmark detection
- **Processing**: GPU-accelerated, runs in VIDEO mode for real-time detection
- **Gesture Recognition**: Custom logic in `gestureLogic.ts` detecting 23 ASL gestures and BdSL characters/digits

### Key Design Patterns
- **Shared Types**: Schema definitions in `shared/` directory used by both client and server
- **Path Aliases**: `@/` for client source, `@shared/` for shared code, `@assets/` for attached assets
- **Component Organization**: UI primitives in `components/ui/`, feature components at `components/` root
- **Context Providers**: Nested providers for Auth, Emergency, and Accessibility state

## External Dependencies

### Authentication & Database
- **Supabase**: Authentication service and potential database backend
  - Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
- **PostgreSQL**: Primary database via `DATABASE_URL` environment variable
- **pg**: Node.js PostgreSQL client for Drizzle connection

### Computer Vision
- **MediaPipe**: Hand landmark detection models loaded from Google's CDN
  - WASM files: `cdn.jsdelivr.net/npm/@mediapipe/tasks-vision`
  - Model: `storage.googleapis.com/mediapipe-models/hand_landmarker`

### UI Component Libraries
- **shadcn/ui**: Component collection built on Radix UI primitives
- **Radix UI**: Accessible primitive components (dialog, dropdown, tabs, etc.)
- **Lucide React**: Icon library
- **FontAwesome**: Additional icons for sign language guide

### Media
- **react-webcam**: Webcam access for sign detection
- **Web Speech API**: Browser-native voice recognition (no external service)

### Fonts
- **Google Fonts**: Inter (body) and Outfit (display) loaded via CDN