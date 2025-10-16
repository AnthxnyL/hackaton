import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import router from './router.js'

// Load environment variables as early as possible
dotenv.config()

const port = process.env.PORT || 3001;
const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connecté à MongoDB Atlas'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})