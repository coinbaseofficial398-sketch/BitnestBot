# BitNest Finance Telegram Bot Dashboard

## Overview

BitNest Finance is a comprehensive Telegram bot dashboard application for a decentralized finance (DeFi) platform. The system provides a web-based interface to monitor and manage a Telegram bot that offers financial services including automated yield farming (BitNest Loop), zero-risk savings (BitNest Savings), asset leasing (BitNest Lease), and a cryptocurrency wallet. The dashboard displays real-time statistics, simulates bot interactions, and provides investment calculation tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side is built with React 18 using TypeScript and leverages modern web technologies:
- **React Router**: Uses Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state management and caching
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build System**: Vite for fast development and optimized production builds

### Backend Architecture
The server-side follows a RESTful API pattern using Express.js:
- **Framework**: Express.js with TypeScript for type safety
- **Database Layer**: Drizzle ORM for type-safe database operations with PostgreSQL
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development
- **Service Layer**: Modular services for Telegram bot operations and wallet management

### Data Storage Solutions
The application uses a flexible storage architecture:
- **Primary Database**: PostgreSQL with Drizzle ORM for schema management and migrations
- **Connection**: Neon Database serverless PostgreSQL for cloud deployment
- **Schema**: Three main entities - users, bot statistics, and investment calculations
- **Development Storage**: In-memory storage implementation for rapid development and testing

### Authentication and Authorization
Currently implements a simplified authentication model:
- **User Identification**: Telegram user ID-based identification
- **Session Management**: Basic user tracking through Telegram integration
- **Access Control**: Service-level validation for wallet operations and user data access

### External Dependencies
The system integrates with several external services and APIs:
- **Telegram Bot API**: Core integration for bot functionality and user interaction
- **Cryptocurrency Wallets**: Support for MetaMask and WalletConnect protocols
- **Database Services**: Neon Database for PostgreSQL hosting
- **Development Tools**: Replit-specific plugins for development environment integration

The architecture emphasizes modularity, type safety, and developer experience while maintaining the flexibility to scale from development to production environments.