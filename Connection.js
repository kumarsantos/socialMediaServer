const mongoose=require('mongoose')
const {MONGODBURI}=require('./key')

const connectDB = async()=>{
    await mongoose.connect(MONGODBURI,{ useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true },(err)=>{
        if(err) throw err;
        console.log("connected to mongodb...!");

    });
}

module.exports=connectDB;