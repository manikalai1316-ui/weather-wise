# AI WeatherWise

Intelligent weather forecasts and insights powered by Node.js, Express, MongoDB, OpenWeatherMap, and Google Gemini AI.

## Features

- JWT authentication with bcrypt password hashing
- CRUD for favorite locations
- Real-time weather via OpenWeatherMap (with fallback mode)
- AI summaries and activity recommendations via Gemini (with fallback mode)
- Role-based admin routes
- Request sanitization and centralized error handling

## Prerequisites

- Node.js v16+
- MongoDB running locally or a cloud connection string
- Optional: OpenWeatherMap API key, Gemini API key

## Setup

```bash
npm install
```

Copy `.env.example` to `.env` and configure:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/ai-weatherwise
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

## Run

```bash
npm start
# or for development
npm run dev
```

Server starts at `http://localhost:5000`.

## API Endpoints

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive JWT |
| GET | `/api/auth/profile` | Yes | Get current user profile |
| PUT | `/api/auth/profile` | Yes | Update name, email, or password |

**Register body:**
```json
{ "name": "Alex", "email": "alex@example.com", "password": "password123" }
```

### Locations (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/locations` | List favorite locations |
| POST | `/api/locations` | Add a favorite city |
| PUT | `/api/locations/:id` | Update a location |
| DELETE | `/api/locations/:id` | Remove a location |

**Add location body:**
```json
{ "city": "London", "country": "UK" }
```

### Weather

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/weather/city/:city?country=UK` | No | Current weather for a city |
| GET | `/api/weather/location/:id` | Yes | Weather for a saved location |

### AI Insights (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/summary` | Natural language weather summary |
| POST | `/api/ai/recommendations` | Activity and clothing suggestions |

**AI request body (option A – by city):**
```json
{ "city": "London", "country": "UK" }
```

**AI request body (option B – saved location):**
```json
{ "locationId": "665f1a2b3c4d5e6f7a8b9c0d" }
```

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/health` | No | API health and integration status |
| GET | `/api/admin/users` | Admin | List all users |
| DELETE | `/api/admin/users/:id` | Admin | Delete a user account |

## Authorization

Send the JWT token in the header:

```
Authorization: Bearer <your_token>
```

## Fallback Mode

If `OPENWEATHER_API_KEY` or `GEMINI_API_KEY` are not set, the API still works using built-in fallback weather data and rule-based AI responses.

## Project Structure

```
├── index.js
├── config/db.js
├── models/User.js, Location.js
├── controllers/
├── middleware/
├── routes/
└── services/
```
