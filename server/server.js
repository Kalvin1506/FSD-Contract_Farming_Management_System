import 'dotenv/config'; import app from './app.js'; import { connectDB } from './config/db.js';
connectDB().then(()=>app.listen(process.env.PORT||5000,()=>console.log(`API listening on ${process.env.PORT||5000}`))).catch(err=>{console.error('Database connection failed:',err.message);process.exit(1);});
