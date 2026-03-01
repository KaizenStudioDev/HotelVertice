# Boutique Hotel API - Documentation

Welcome to the backend API for the Boutique Hotel Reservation System. This API handles rooms, user authentication, and reservations.

## Tech Stack
- **Node.js**: v18+
- **TypeScript**: v5+
- **Express**: Framework
- **Supabase**: Auth & PostgreSQL Database
- **Vitest**: Testing framework (>70% coverage)

## Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file based on `.env.example` with your Supabase credentials.
4. `npm start` (Development with hot-reload)

## Endpoints

### 1. Authentication (`/api/auth`)
- `POST /register`: Create a new user (Guest/Receptionist/Admin).
- `POST /login`: Authenticate and get a JWT session.
- `GET /profile`: Get the authenticated user's profile (Requires Token).

### 2. Rooms (`/api/rooms`)
- `GET /`: List all 24 rooms with details.
- `GET /:id`: Get specific room details.

### 3. Reservations (`/api/reservations`) - Requires Authentication
- `GET /`: List the authenticated user's reservations.
- `POST /`: Create a new reservation (Checks for date overlap and calculates total price).
- `PATCH /:id/cancel`: Cancel an existing reservation.

## Testing & Quality
Run the full test suite with coverage report:
```bash
npm run coverage
```
**Current Coverage**: ~76% (Meets >70% requirement).
