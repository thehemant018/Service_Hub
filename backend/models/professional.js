const mongoose=require('mongoose');
const {Schema}=mongoose;

const ProfSchema=new Schema({
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
    aadhar:{
        type:String,
        require:true,
        unique:true,
        minlength: 12,
        maxlength: 12
    },
    category:{
        type:String,
        require:true,
        default:"Serviceman"
    },
    city:{
        type:String,
        require:true,
        default:"Anand"
    },
    address:{
        type:String,
        require:true,
        default:"ADIT boys hostel, Anand"
    },
    contact:{
        type:Number,
        require:true,
        default:"9545887585"
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
    ratings: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 }
    },
    image: {
        type: String // Store image path as string
    }
})

const Professional=mongoose.model('professional',ProfSchema);
module.exports=Professional;