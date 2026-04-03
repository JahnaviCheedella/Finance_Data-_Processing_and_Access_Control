# Finance Data Processing and Access Control System - Backend
This is a robust Node.js and Express representation of the Finance Data backend, built with Clean Architecture, RBAC (Role-Based Access Control), and raw PostgreSQL queries to demonstrate maximum control over data interactions.

## Key Features
- **Clean Architecture Pattern** (Controller -> Service -> Repository) 
- **Zod Request Validation** (Ensures strictly typed input data)
- **Centralized Error Handling** 
- **Stateless Authentication** (JWT with Access and Refresh Tokens)
- **Role-based Access Control (RBAC)** [Viewer, Analyst, Admin]
- **Robust SQL execution** via `pg` driver using parametrized queries preventing SQL injections.

---

## Setup Instructions

### 1. Database Setup (pgAdmin)
This application assumes you have a running PostgreSQL instance. The DDL queries and dummy data are provided explicitly so you can run them in pgAdmin.

1. Create a database called `finance_db` inside pgAdmin.
2. Open the query tool on `finance_db`.
3. Locate the `database_scripts` folder in this repository.
4. Execute `01_schema.sql` (Creates Enum types, tables, UUID extensions, and indexes).
5. Execute `02_seed.sql` (Inserts an Admin, Analyst, and Viewer dummy user, plus sample dummy financial records).
6. Execute `03_dashboard_queries.sql` (Optional: Explore the standalone aggregation query patterns).

### 2. Application Setup
1. Open this `backend` folder in your terminal.
2. Run `npm install` to install dependencies.
3. Make a copy of `.env.example` and name it `.env`. Ensure your `DB_PASSWORD` and other configs match your local PostgreSQL setup.
4. Run `npm run dev` to start the development server with nodemon.

---

## API Documentation & Usage

### Base URL: `http://localhost:5000/api`

### 1. Authentication
*All protected routes require the Access JWT passed in the `Authorization: Bearer <TOKEN>` header.*

#### `POST /auth/login`
**Request Body:**
```json
{
  "email": "[EMAIL_ADDRESS]",
  "password": "[PASSWORD]"
} 
```
**Response:**
Returns user profile along with `accessToken` and `refreshToken`.

#### `POST /auth/refresh`
**Request Body:**
```json
{
  "refreshToken": "<YOUR_REFRESH_TOKEN>"
}
```
**Response:** Issues matching new access and refresh tokens.

---

### 2. Financial Records
*(Accessible by Admin/Analyst. Viewer can only LIST and GET BY ID)*

#### `GET /records`
Lists records. Supports pagination and filtering. 
**Examples:**
- `GET /records?page=1&limit=10`
- `GET /records?type=EXPENSE&category=Utilities`

#### `POST /records`
**Request Body:**
```json
{
  "amount": 250.50,
  "type": "EXPENSE",
  "category": "Office Supplies",
  "date": "2023-11-20",
  "description": "Ergonomic chair"
}
```

#### `PUT /records/:id`
Updates any subset of specified fields dynamically safely preventing SQL injections via parameterized array matching.

#### `DELETE /records/:id`
Soft deletes the record (`is_deleted` = true).

---

### 3. Dashboard Summaries
*(Aggregated APIs - Accessible by all authenticated roles)*

- `GET /dashboard/summary` - Returns Total Income, Total Expense, Net Balance.
- `GET /dashboard/category-breakdown` - Sum of amounts grouped by category and type.
- `GET /dashboard/monthly-trends` - Income vs Expense sums per month across the last 6 months.
- `GET /dashboard/recent-transactions` - Lists the top 5 most recent records globally.

---

### 4. Admin Management
*(Accessible STRICTLY by `ADMIN` roles)*

- `GET /users` - View all users.
- `PATCH /users/:id/role` - Pass `{"role": "ANALYST"}`
- `PATCH /users/:id/status` - Pass `{"status": "INACTIVE"}` to disable user access login.
