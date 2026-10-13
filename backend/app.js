import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { config } from "dotenv";
import { fileURLToPath } from "node:url";

import dbConnection from "./database/dbConnection.js";

import userRouter from "./routes/userRoutes.js";
import internshipRouter from "./routes/InternshipRoutes.js";
import collegeRouter from "./routes/collegeRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";

import { errorMiddleware } from "./middlewares/error.js";
import dashboardRouter from "./routes/dashboardRoutes.js";

// Resolve .env beside this file so startup works from any working directory.
config({ path: fileURLToPath(new URL("./.env", import.meta.url)) });

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,

    // Windows-compatible temp directory
    tempFileDir: "./temp/",
    createParentPath: true,
  })
);

// API Routes
app.use("/api/v1/user", userRouter);

app.use(
  "/api/v1/internship",
  internshipRouter
);

app.use(
  "/api/v1/application",
  applicationRouter
);

app.use(
  "/api/v1/college",
  collegeRouter
);

app.use(
  "/api/v1/dashboard",
  dashboardRouter
);

// Database
dbConnection();

// Error Middleware
app.use(errorMiddleware);

export default app;
