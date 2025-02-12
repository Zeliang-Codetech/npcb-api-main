import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import moment from "moment-timezone";
import cors from "cors";
import { APP_PORT, APP_URL } from "./src/config/index.js";
import Database from "./src/config/database.js";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import router from "./src/routes/index.js";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
var corsOptions = {
  // origin: "http://localhost:3000",
  origin: true,
  credentials: true,
};
moment.tz.setDefault("Asia/Kolkata");
Database();
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.status(401).send({ status: false, message: "Invalid Credentials" });
});
global.appRoot = path.resolve(__dirname);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

app.use((req, res, next) => {
  next();
});

app.use(router);
app.use(express.static("public"));
app.use((req, res, next) => {
  res.status(404).json({
    status: false,
    message: "Not Found",
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: false,
    message: err.message,
  });
});

app.listen(APP_PORT || 8081, () => {
  console.log(`Server running on PORT ${APP_PORT}`);
});
