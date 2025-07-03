# Trivium - Cognitive Architecture Application

## Overview

Trivium is a full-stack cognitive architecture application designed to process user input through multiple philosophical lenses. The application provides a unique perspective on text analysis by applying different cognitive frameworks (Ethical, Emotional, Logical, and Symbolic) to generate insights and synthesis. Built with a modern tech stack featuring React frontend, Express backend, and PostgreSQL database, the application incorporates a mystical "Krishna Layer" that observes user interactions and provides meta-cognitive insights.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom cosmic theme variables
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration for development and production

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ESM modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: In-memory storage with planned database persistence
- **API Design**: RESTful endpoints with structured JSON responses
- **Development**: Hot module replacement via Vite middleware integration

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema**: Centralized schema definitions in shared directory
- **Migrations**: Drizzle Kit for database migrations
- **Connection**: Neon Database serverless PostgreSQL
- **Storage Strategy**: Hybrid approach with in-memory cache and persistent storage

## Key Components

### Lens Manager Service
The core processing engine that handles text analysis through different cognitive perspectives:
- **Ethical Lens**: Analyzes moral implications and value systems
- **Emotional Lens**: Processes emotional intelligence and empathy aspects
- **Logical Lens**: Applies rational analysis and systematic thinking
- **Symbolic Lens**: Interprets patterns, archetypes, and deeper meanings

Each lens implements a common interface with a `process()` method that transforms input text based on its unique perspective, incorporating sovereignty data from the neuron map.

### Krishna Layer Service
A meta-cognitive observer system that tracks user interactions and provides insights:
- **Observer Component**: Logs system state and user input per session
- **Light of Attention**: Triggers pulse insights every 9 API calls
- **Neuron Map Integration**: Utilizes 72 Sovereignties from YAML configuration
- **Session Tracking**: Monitors API call patterns and active neuron states

### Storage Layer
Abstracted storage interface supporting both in-memory and persistent storage:
- **Session Management**: User session creation and state tracking
- **Process Requests**: Historical record of lens processing requests
- **Observer Insights**: Meta-cognitive insights and system observations
- **Sovereignty Data**: Static neuron map data loaded from YAML configuration

## Data Flow

1. **User Input**: Text and lens selection submitted via React frontend
2. **Session Creation**: Backend creates or retrieves user session
3. **Lens Processing**: Selected lenses process the input text through their respective perspectives
4. **Krishna Observation**: Meta-cognitive layer observes the interaction and generates insights
5. **Response Generation**: Processed outputs and observer insights returned to frontend
6. **UI Update**: React components update to display multi-lens analysis and synthesis options

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React Query, React Hook Form
- **UI Components**: Radix UI primitives, shadcn/ui component library
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Database**: Drizzle ORM, PostgreSQL, Neon Database serverless
- **Development**: Vite, TypeScript, ESBuild for production builds

### Third-Party Services
- **Database Hosting**: Neon Database for serverless PostgreSQL
- **Development Environment**: Replit-specific plugins and error handling
- **Session Storage**: PostgreSQL with connect-pg-simple for session management

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Module Replacement**: Integrated Vite middleware for rapid development
- **Environment Variables**: DATABASE_URL for database connection
- **Script Commands**: Separate dev, build, and production scripts

### Production Build
- **Frontend**: Vite build with optimized bundle output
- **Backend**: ESBuild compilation to ESM format
- **Database**: Drizzle push for schema synchronization
- **Hosting**: Prepared for Node.js deployment with static file serving

### Configuration Management
- **TypeScript**: Comprehensive type checking across client, server, and shared code
- **Path Aliases**: Organized import paths for client components and shared utilities
- **Environment**: NODE_ENV-based configuration for development and production modes

## Recent Updates

✓ Added custom cognitive lens creation system
✓ Created archetypal foundation framework with 7 core archetypal bases
✓ Implemented lens validation and coverage analysis
✓ Built comprehensive SDK with TypeScript core and Python integration
✓ Created custom lens management API endpoints
✓ Added tabbed interface for analysis and lens creation
✓ Analyzed archetypal completeness of current framework
✓ Fixed database integration issues - application running smoothly
✓ Built production-ready NPM package (5.2 kB, zero dependencies)
✓ Created comprehensive PyPI Python package with Jupyter integration
✓ Developed VS Code extension with right-click cognitive analysis
✓ Prepared complete publication strategy for NPM + PyPI + VS Code Marketplace

## Changelog

```
Changelog:
- July 03, 2025. Initial setup
- July 03, 2025. Added custom lens creation and archetypal analysis framework
- July 03, 2025. Publication-ready SDK with NPM/PyPI packages and VS Code extension
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```