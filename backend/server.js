require('dotenv').config();
const express=require('express');
const connectDatabase = require('./configs/db');
const userRouter = require('./routers/userRouter');
const cors = require('cors');
const app=express();
app.use(cors());

app.use(express.json());
app.use(userRouter)

const port=process.env.port;
app.listen(port,async()=>{
    try{
       await connectDatabase(process.env.mongodb_url);
        console.log(`server is running at port ${port}`);

    }catch(err){
        console.log(err);
    }
})
//change.......