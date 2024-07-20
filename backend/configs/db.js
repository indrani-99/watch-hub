require('dotenv').config();
const mongoose=require('mongoose');

const connectionWithDB=async ()=>{
    try{
        await mongoose.connect(process.env.MONGOURI);
        console.log("Database connected");
    }
    catch(err){
        console.log(err);
    }
}

module.exports={connectionWithDB};