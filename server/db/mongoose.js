const mongoose = require("mongoose");

const taskManagerConnectionURL = process.env.MONGODB_CONNECTION_STRING;

mongoose.set("strictQuery", false);

mongoose.connect(taskManagerConnectionURL, {
    useNewUrlParser: true,
});