const mongoose=require('mongoose');
// const mongoURL="mongodb://localhost:27017/servicehub";
// const mongoURL='mongodb+srv://marcos:j0vlqymfacgcft1z@cluster0.2tf4hth.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const mongoURL='mongodb+srv://leo:MJ8D7eo4ED9m73tB@leo.rvrbgwh.mongodb.net/';


const connectToMongo=()=>{
    mongoose.connect(mongoURL);
    console.log('Mongo Db connected');
}

module.exports=connectToMongo;
