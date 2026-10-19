# AgriLink — Contract Farming Management System

A role-based MERN platform that manages a contract farming season from opportunity discovery to payment. It connects farmers, companies, field officers, and platform administrators through one auditable workflow.

## What is included

- JWT authentication, password hashing, account roles, and protected APIs
- Farm profiles with location-ready schema and image field
- Commercial contracts, duplicate-safe applications, selection and notifications
- Crop monitoring visits, harvest submissions, quality inspections and payments
- Rule-ready data design for production risk and operational alerts
- A responsive React/Vite agriculture dashboard with contracts marketplace, data visualisation, and role workspaces
- MongoDB seed data for a working Tomato contract storyline

## Architecture

`client/` is the Vite React UI. `server/` contains Express routes, role middleware, Mongoose models, controllers, configuration, and seed data. The REST API is served under `/api`.

## Run locally

1. Install Node.js 20+ and MongoDB 7+.
2. Copy `server/.env.example` to `server/.env` and set `MONGO_URI` and a secure `JWT_SECRET`.
3. From the project root run:

```powershell
npm.cmd install
npm.cmd run seed
npm.cmd run dev
```

Open `http://localhost:5173`. The API is available at `http://localhost:5000/api/health`.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@example.com | Admin@123 |
| Company | company@example.com | Company@123 |
| Farmer | farmer@example.com | Farmer@123 |
| Field officer | officer@example.com | Officer@123 |

## API overview

`/auth`, `/users`, `/farmers`, `/companies`, `/officers`, `/farms`, `/contracts`, `/applications`, `/crop-monitoring`, `/harvests`, `/quality-inspections`, `/payments`, `/notifications`, `/complaints`, and `/dashboard`.

Use `Authorization: Bearer <token>` for protected endpoints. The workflow endpoints include `POST /applications` for farmer applications and `PATCH /applications/:id/decision` for a company/admin acceptance or rejection.

## Cloudinary and uploads

The supplied model fields are prepared to store Cloudinary URLs. Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` before enabling the upload adapter. A local Multer upload fallback should be used in development for a full upload rollout.

## Implemented workflow

The application includes working role-specific screens and APIs for farm profiles, contract creation and discovery, farmer applications, buyer decisions, field monitoring, harvest submission and approval, quality inspection, payment tracking, notifications, complaints, user administration, and analytics. API reads and mutations are scoped to the signed-in role and record ownership.

Run `npm.cmd test` for the isolated MongoDB integration suite, `npm.cmd run lint` for frontend checks, and `npm.cmd run build` for the production client build.

For an internet-facing deployment, replace the local JWT secret, configure managed MongoDB, restrict CORS to the deployed client, enable HTTPS, and connect the prepared image URL fields to Cloudinary or another object store.

## Screenshots

Add desktop dashboard, contract marketplace, crop monitoring and mobile workspace screenshots here after deployment.
