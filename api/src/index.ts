import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import { adminRoutes } from './admin.routes';
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { ambassadorRoutes } from './ambassador.routes';
import { createClient } from 'redis';


dotenv.config();

export const redisClient = createClient({
  url: process.env.REDIS_URL
})

AppDataSource.initialize().then(async () => {
  console.log("Data Source has been initialized!");

  await redisClient.connect();

  const app = express();

  app.use(cookieParser());
  app.use(express.json());
  app.use(cors({
    origin: 'http://localhost:3001',
  }));

  const adminRouter = express.Router();
  adminRoutes(adminRouter);
  app.use("/api/admin", adminRouter);

  const ambassadorRouter = express.Router();
  ambassadorRoutes(ambassadorRouter);
  app.use("/api/ambassador", ambassadorRouter);

  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
})
.catch((error) => {
  console.error('Error during Data Source initialization:', error);
});