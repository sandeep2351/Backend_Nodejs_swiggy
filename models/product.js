const mongoose=require('mongoose')

const productschema=new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    category:{
        type:[
            {
                type:String,
                enum:["veg","non-veg"]
            }
        ]
    },
    image:{
        type:String,
        
    },
    bestseller:{
        type:Boolean,
    },
    description:{
        type:String
    },
    firm:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Firm'
    }]
})

const product=mongoose.model("product",productschema)
module.exports=product