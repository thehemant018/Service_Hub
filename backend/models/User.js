const mongoose=require('mongoose');
const {Schema}=mongoose;

const UserSchema=new Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    contact:{
        type:Number,
        default:"9545887585",
        require:true,
    },
    address:{
        type:String,
        require:true,
        default:"ADIT boys hostel, Anand"
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number], // Array of [longitude, latitude]
            required: true
        }
    },
    
    date:{
        type:String,
        default:new Date(+new Date() + 7*24*60*60*1000)
    },
    subscription:{
        type:String,
    },
    subscriptionStatus:{
        type:String,
        default: 'pending',
    },
   
})

const User=mongoose.model('user',UserSchema);
module.exports=User;