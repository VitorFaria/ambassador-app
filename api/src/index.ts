import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import { routes } from './routes';

AppDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");

  const app = express();

  app.use(express.json());
  app.use(cors({
    origin: 'http://localhost:3001',
  }));

  routes(app);

  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
})
.catch((error) => {
  console.error('Error during Data Source initialization:', error);
});