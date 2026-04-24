import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import doctorUserrouter from './featureWeb/doctorManagement.js'

const app = express();
app.use(express.json());
app.use('/user/', doctorUserrouter);


app.listen(3000, () => {
  console.log(`Server running at http://localhost:${3000}`);
});