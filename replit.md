# Real-Time Collaborative Code Editor

## Overview

This is a full-stack real-time collaborative code editor application built with React, TypeScript, Express.js, and WebSockets. The application allows multiple users to create coding rooms, share files, edit code collaboratively in real-time, and communicate through chat. It features a modern UI built with shadcn/ui components and supports syntax highlighting for multiple programming languages through Monaco Editor.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client is built as a Single Page Application (SPA) using React with TypeScript and Vite as the build tool. The UI framework leverages shadcn/ui components built on top of Radix UI primitives, providing a consistent design system with dark mode support. The application uses Wouter for client-side routing and TanStack Query for server state management and caching.

**Key Design Decisions:**
- **Component Library**: Chose shadcn/ui for its accessibility, customizability, and comprehensive component set
- **State Management**: TanStack Query handles server state while React Context manages editor-specific state
- **Routing**: Wouter provides a lightweight routing solution suitable for the simple navigation requirements
- **Styling**: Tailwind CSS with CSS variables enables consistent theming and responsive design

### Backend Architecture
The server follows an Express.js REST API pattern with WebSocket integration for real-time features. The application uses a layered architecture with separate concerns for routing, business logic, and data persistence.

**Key Design Decisions:**
- **API Design**: RESTful endpoints for CRUD operations with WebSocket channels for real-time collaboration
- **Storage Abstraction**: Interface-based storage layer allows switching between in-memory and database implementations
- **Error Handling**: Centralized error handling middleware with consistent response formats
- **Development Setup**: Vite integration for hot module replacement in development

### Data Storage
The application uses Drizzle ORM with PostgreSQL for data persistence, featuring a well-defined schema for users, rooms, files, and chat messages. The storage layer implements an interface pattern allowing for flexible data source switching.

**Database Schema:**
- **Users**: Authentication and user management
- **Rooms**: Collaborative workspaces with ownership tracking
- **Files**: Code files with language detection and version tracking
- **Chat Messages**: Real-time communication within rooms

**Key Design Decisions:**
- **ORM Choice**: Drizzle provides type-safe database queries with minimal overhead
- **Schema Design**: UUID primary keys ensure scalability and avoid enumeration attacks
- **Timestamps**: Automatic creation and update tracking for audit trails

### Real-Time Collaboration
WebSocket implementation enables real-time code editing, cursor tracking, and chat functionality. The system handles user presence, collaborative editing conflicts, and message broadcasting.

**Key Design Decisions:**
- **WebSocket Management**: Single WebSocket connection per client with room-based message routing
- **Conflict Resolution**: Last-write-wins strategy for simplicity with potential for operational transforms
- **User Presence**: Real-time tracking of active users and their cursor positions

### Authentication & Authorization
The application implements a session-based authentication system with PostgreSQL session storage for scalability and persistence.

**Key Design Decisions:**
- **Session Storage**: Database-backed sessions ensure reliability across server restarts
- **Authorization**: Room-based access control with creator privileges
- **Security**: Environment-based configuration for database credentials and session secrets

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL driver optimized for edge computing
- **drizzle-orm**: Type-safe ORM with excellent TypeScript integration
- **express**: Web framework for REST API endpoints and middleware
- **ws**: WebSocket library for real-time communication

### Frontend UI Dependencies
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **@tanstack/react-query**: Server state management with caching and synchronization
- **@monaco-editor/react**: VS Code's editor for syntax highlighting and code editing
- **tailwindcss**: Utility-first CSS framework for responsive design

### Development & Build Tools
- **vite**: Fast build tool with hot module replacement
- **typescript**: Type safety across the entire application
- **drizzle-kit**: Database migration and schema management tools

### Third-Party Integrations
The application is configured to work with Neon Database for PostgreSQL hosting, providing serverless database capabilities with automatic scaling. The Monaco Editor integration provides VS Code-like editing experience with syntax highlighting for multiple programming languages.