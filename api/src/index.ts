import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import { routes } from './routes';
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";


dotenv.config();

AppDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");

  const app = express();

  app.use(cookieParser());
  app.use(express.json());
  app.use(cors({
    origin: 'http://localhost:3001',
  }));

  const router = express.Router();
  routes(router);

  app.use("/api/admin", router);

  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
})
.catch((error) => {
  console.error('Error during Data Source initialization:', error);
});