const mongoose=require('mongoose');

const connectDatabase=async(url)=>{
    try{
        await mongoose.connect(url)
        console.log("mongodb connected");
    }catch(err){
        console.log(err);
    }

}
module.exports=connectDatabase