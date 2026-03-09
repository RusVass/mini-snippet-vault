# Mini Snippet Vault

Mini Snippet Vault is a small full-stack application for saving useful snippets such as links, notes, and commands.
It supports tags, search, filtering, and pagination.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- NestJS, TypeScript
- MongoDB via Mongoose
- Validation with class-validator and class-transformer

## Features

- CRUD operations for Snippet
- Search by title and content
- Filter by tag and snippet type
- Pagination using page and limit
- UI states for loading, empty, and error
- Basic frontend form validation

## Project structure

```txt
mini-snippet-vault/
  backend/
  frontend/
  README.md
```

## Snippet entity

Fields:

- title
- content
- tags
- type
- createdAt
- updatedAt

type values:

- link
- note
- command

## Local setup

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd mini-snippet-vault
```

### 2. Configure environment variables

Backend:

`backend/.env`

```env
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/snippet-vault
```

Frontend:

`frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:3001
```

Environment examples are included:

- `backend/.env.example`
- `frontend/.env.example`

### 3. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4. Run in development mode

```bash
# terminal 1
cd backend
npm run start:dev

# terminal 2
cd frontend
npm run dev
```

Backend:

`http://127.0.0.1:3001`

Frontend:

`http://localhost:3000`

## API quick check

Base URL:

`http://127.0.0.1:3001`

Endpoints:

- Create snippet -> `POST /snippets`
- Get list -> `GET /snippets`
- List with params -> `GET /snippets?q=nest&tag=backend&type=link&page=1&limit=10`
- Get one -> `GET /snippets/:id`
- Update -> `PATCH /snippets/:id`
- Delete -> `DELETE /snippets/:id`

Example `POST /snippets`:

```json
{
  "title": "Nest docs",
  "content": "https://docs.nestjs.com",
  "tags": ["nestjs", "backend"],
  "type": "link"
}
```

Example `PATCH /snippets/:id`:

```json
{
  "title": "Updated title",
  "content": "Updated content",
  "tags": ["updated", "docs"],
  "type": "note"
}
```

## Build and production run

Backend:

```bash
cd backend
npm run build
npm run start:prod
```

Frontend:

```bash
cd frontend
npm run build
npm run start
```

## Implementation notes

Backend:

- DTO validation using ValidationPipe
- Proper 400 and 404 error handling
- Modular NestJS structure

Database:

- Mongoose schema with timestamps
- Text index on title and content for search

Frontend:

- Integration with API using fetch
- Pages for list, details, and editing
- Clean Tailwind UI with basic validation

