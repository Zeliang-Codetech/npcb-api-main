import mongoose from "mongoose";
const Database = async () => {
  try {
    await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // user: "pritam",
        // pass: "Pritam@123",
        // authSource: "admin",
      }
    );

    // Enable query logging
    // mongoose.set("debug", (collectionName, method, query, doc) => {
    //   console.log(`${collectionName}.${method}`, JSON.stringify(query), doc);
    // });

    mongoose.connection.once("open", () => {
      console.log("MongoDB connection is successful");
    });
    mongoose.connection.on("error", (error) => {
      console.error("Error connecting to MongoDB:", error);
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};
export default Database;
