# NestJS Post API

A RESTful API for managing blog posts, built with [NestJS](https://nestjs.com/), TypeORM, and PostgreSQL. Includes Swagger (OpenAPI) documentation and is ready for serverless deployment on Vercel.

## Features

- CRUD operations for blog posts (title, content, author)
- PostgreSQL database integration via TypeORM
- Environment-based configuration
- Swagger UI for API documentation (`/api`)
- CORS enabled
- Ready for Vercel serverless deployment

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm (or npm/yarn)
- PostgreSQL database

### Installation

```sh
pnpm install
```

### Environment Variables

Create a `.env` file or use `.env.development.local` (see `.vercel/README.txt` for Vercel setup). Example:

```env
POSTGRES_URL=postgres://username:password@localhost:5432/yourdbname
NODE_ENV=development
```

#### Vercel Environment Variables

To link your project and pull environment variables from Vercel:

```sh
vercel link
vercel pull
```

This will create a local `.env` file with your Vercel project environment variables.

### Running Locally

```sh
pnpm start
```

Visit [http://localhost:3000/api](http://localhost:3000/api) for Swagger UI.

### Project Structure

```
src/
  app-factory.ts      # Express/NestJS app factory (serverless ready)
  app-module.ts       # Main NestJS module
  main.ts             # Local entry point
  posts/              # Posts module (controllers, services, entities, DTOs)
```

### API Endpoints

- `POST /posts` — Create a new post
- `GET /posts` — Get all posts
- `GET /posts/:id` — Get a post by ID
- `PATCH /posts/:id` — Update a post
- `DELETE /posts/:id` — Delete a post

See Swagger UI for full details and request/response schemas.

### Deployment

- Deploy to [Vercel](https://vercel.com/) for serverless hosting.
- The project is configured to use the `.vercel` folder for environment variables and project linking.

## License

MIT
