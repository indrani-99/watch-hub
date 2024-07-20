require('dotenv').config();
const express=require('express');
const http=require('http');
const port=process.env.PORT;
const { Server } = require("socket.io");
const socketIo = require('socket.io');
const cors = require('cors');
const { roomRoute } = require('./routes/room.routes');
const { userRouter } = require('./routes/user.routes');
const { connectionWithDB } = require('./configs/db');
const app=express();
const server=http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json());
app.use('/user',userRouter);
app.use('/room',roomRoute);
app.get('/', (req, res)=>{
    res.send("Home Page");
})
server.listen(port,async()=>{
    try{
       await connectionWithDB();
        console.log(`server is running at port ${port}`);

    }catch(err){
        console.log(err);
    }
})

