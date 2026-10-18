# Piarch-A-Locations

Location and tourism microservice for the Piarcha platform. Provides geographical data (countries, cities), attraction information, and tour generation capabilities.

## Tech Stack

- **Runtime**: Node.js / TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Data Sources**: `countries-list` and `cities-list` NPM packages for static geo data
- **Shared Types**: `piarch-a-interfaces` package (Availability, TourType, AttractionType)
- **Deployment**: Docker, Kubernetes, Heroku

## Project Structure

```
cluster.ts                  # Entry point: forks one index.ts worker per CPU core
index.ts                    # Express app, all API route definitions
src/
  database.ts              # MongoDB connection & initialization
  countryCityService.ts    # Singleton service for country/city lookups
models/
  Location.ts              # Mongoose schema (countries, cities, coordinates, tours)
types/
  Location.ts              # TypeScript interfaces
seeder/
  initialSeeder.ts         # Seeds DB with sample countries and attractions
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/countryList` | All countries with featured status |
| GET | `/countries` | All countries (standardized) |
| GET | `/cityList/:country` | Cities for a country (legacy) |
| GET | `/cities/:countryCode` | Cities by country code |
| GET | `/search/cities?q=&limit=` | Search cities globally |
| GET | `/coordinates/:city` | Attraction POIs for a city (coordinates, descriptions) |
| GET | `/tours/:city` | Pre-defined tours (not yet implemented) |
| POST | `/generate-tour` | Generate a tour (currently returns mock data) |

## Data Model

The `Location` document in MongoDB stores:
- Country name and availability (featured flag)
- Cities array with availability status
- Coordinates (attraction POIs): name, x/y, type (Church, Mosque, Museum, etc.), multilingual descriptions (en/tr), advertisement flag
- Tours: name, description, type (Hike/Bike/Trekking)

## Running Locally

```bash
# Configure environment
cp .env.template .env
# Set MONGODB and PORT (default 3019)
# Optional: WEB_CONCURRENCY sets the worker count (default: number of CPU cores)

# Install and start
npm install
npm start

# Seed the database
npx ts-node seeder/initialSeeder.ts
```

## Key Design Decisions

- The app runs in Node `cluster` mode: `cluster.ts` forks a worker per core, each running the full app (`index.ts`) on the shared port. Workers share no memory, so all shared state must live in MongoDB. Crashed workers are restarted after 1s.
- `CountryCityService` is a singleton that loads country/city data from NPM packages at startup, keeping static geo data in memory.
- MongoDB aggregation pipelines are used for coordinate queries (unwinding nested arrays by city).
- Tour generation endpoint is mocked — intended to be replaced with Claude API integration for dynamic tour creation.
