const mongoose=require("mongoose"),taskManagerConnectionURL=process.env.MONGODB_CONNECTION_STRING;mongoose.set("strictQuery",!1),mongoose.connect(taskManagerConnectionURL,{useNewUrlParser:!0});