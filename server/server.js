// server.js
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js";

import showRouter from "./routes/showRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
import adminRouter from "./routes/adminRoutes.js";
import userRouter from "./routes/userRoute.js";
import { clerkMiddleware } from "@clerk/express";  // ← IMPORT

const app = express();

// GLOBAL MIDDLEWARE
app.use(express.json());
app.use(cors());

// CRITICAL: APPLY CLERK MIDDLEWARE FIRST
app.use((req, res, next) => {
  console.log("Global clerkMiddleware running for:", req.method, req.url);
  clerkMiddleware()(req, res, next);
});

// ROUTES
app.use("/api/show", showRouter);
app.use("/api/booking", bookingRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/", (req, res) => res.send("Server is Live!"));

// LOCAL
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  });
}

// VERCEL
let isConnected = false;
export default async function handler(req, res) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  app(req, res);
}