# Internship Portal

A MERN internship portal for students, companies, and colleges. Students can apply for internships, companies can publish roles and manage applicants, and colleges can monitor platform activity.

## Requirements

- Node.js 18 or later
- MongoDB Community Server running locally
- MongoDB Compass (optional, for viewing and managing the local database)

## Local setup

1. Install dependencies in each application:

   ```sh
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

2. Configure the environment files:

   - `backend/.env` configures the API, database, cookies, and Cloudinary.
   - `frontend/.env` sets `VITE_API_URL`; its local default is `http://localhost:4000/api/v1`.
   - Copy the matching `.env.example` file when creating a new environment, then replace placeholder values as needed.

   The backend example connects to the local MongoDB server at `mongodb://127.0.0.1:27017/SIP`. Start the MongoDB service before starting the backend. In Compass, use the same connection string to view the `SIP` database. Compass is a database client; it does not run the MongoDB server itself.

3. Start the backend in one terminal:

   ```sh
   cd backend
   npm run dev
   ```

4. Start the frontend in another terminal:

   ```sh
   cd frontend
   npm run dev
   ```

Open `http://localhost:5173` in your browser.

## Demo data

With the local MongoDB service running, seed sample students, one college, three companies, internships, applications, and private college progress updates:

```sh
cd backend
npm run seed:demo
```

All demo accounts use `DemoPass123!`. Example logins are `student1@demo.com`, `company1@demo.com`, and `college@demo.com` (choose the matching role on the sign-in page). The seed command is safe to rerun and updates only these demo accounts and their demo opportunities.

Students can search roles by job title, keyword, required skill, and location. Companies can review applications, update the student-facing application status, and send a separate private progress note to the student's linked college. Private company notes are available only to College accounts.

## Environment variables

| File | Variable | Purpose |
| --- | --- | --- |
| `frontend/.env` | `VITE_API_URL` | Express API base URL, including `/api/v1`. |
| `backend/.env` | `PORT` | API port; default is `4000`. |
| `backend/.env` | `FRONTEND_URL` | Credentialed CORS origin; default is the Vite URL. |
| `backend/.env` | `DB_URL` | MongoDB connection string. |
| `backend/.env` | `JWT_SECRET_KEY`, `JWT_EXPIRE`, `COOKIE_EXPIRE` | Authentication token and cookie settings. |
| `backend/.env` | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Optional Cloudinary credentials. |

Do not commit production secrets. `.env` files are ignored by Git while `.env.example` files document the required configuration.

## API integration

All frontend requests use `VITE_API_URL`. The default local API base is `http://localhost:4000/api/v1`.

- Authentication: `/user`
- Internships: `/internship`
- Applications: `/application`
- Dashboards: `/dashboard`
- College administration: `/college`

The internship API accepts and returns the same `location`, `type`, `duration`, and numeric `stipend` fields used by the React form and cards. The college dashboard endpoint is available at `/dashboard/college`.
