import express from 'express';
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import userRouter from './routers/userRouter.js';

dotenv.config();

const app = express();

// app.use('/api/users', userRouter)// this is to initialize the users in database

app.get('/', (req, res)=>{
    res.send('Server is ready');
});


app.use(express.json());
app.use(express.urlencoded({extended:true}));

// 从环境变量中读取 MongoDB 连接 URI
const uri = process.env.MONGODB_URI;
console.log(uri)

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(cors());


app.use('/api/users', userRouter);



const port = process.env.PORT || 5000
app.listen(port, ()=>{
    console.log(`Serve at http://localhost:${port}`);
});
