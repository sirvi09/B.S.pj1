import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import { inngest, functions } from './inngest/index.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// Routes
app.get('/', (req, res) => res.send('Server is Live!'));
app.use('/api/inngest', serve({ client: inngest, functions }));

// ————————————————————————
// 1. LOCAL DEVELOPMENT
// ————————————————————————
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;

  // Connect DB once at startup
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  });
}

// ————————————————————————
// 2. VERCEL SERVERLESS HANDLER
// ————————————————————————
let dbConnected = false;

export default async function handler(req, res) {
  // Connect DB only once per cold start
  if (!dbConnected) {
    await connectDB();
    dbConnected = true;
    console.log('MongoDB connected (Vercel)');
  }

  // Let Express handle the request
  app(req, res);
}