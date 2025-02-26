import mongoose from "mongoose";

const Database = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.once("open", () => {
      console.log("MongoDB Atlas connection is successful");
    });

    mongoose.connection.on("error", (error) => {
      console.error("Error connecting to MongoDB Atlas:", error);
    });

    console.log("MongoDB Atlas connected successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB Atlas:", error);
  }
};

export default Database;
