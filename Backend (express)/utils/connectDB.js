const mongoose = require("mongoose")
require("dotenv").config();

exports.connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,  // Ensures a stable connection
        });
        console.log("✅ Connection to mongodb successful!!!")
    } catch (error) {
        console.log("❌ Connection to the database failed.", error);
        process.exit(1);
    }
}