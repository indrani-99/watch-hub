const mongoose=require('mongoose');


const memberSchema=new mongoose.Schema({
    username: { type: String },
    joinedAt: { type: Date, default :Date.now},
    leftAt:{type: Date},
    userid:{type: String},
    role: { type: String, enum: ['host', 'participant'], default: 'participant' },
}, {_id:false})
const roomSchema=mongoose.Schema({
hostid:{type:String, required:true},
hostname:{type:String, required:true},
createdAt:{type:Date, default :Date.now},
deletedAt: {type:Date, default:null},
roomname:{type:String,unique:true,required:true},
members: { type: [memberSchema]}
}, {versionKey:false})


const RoomModel=mongoose.model('Room', roomSchema)
module.exports={
    RoomModel
}