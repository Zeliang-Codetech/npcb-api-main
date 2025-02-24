import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import moment from "moment-timezone";
import cors from "cors";
import { APP_PORT, APP_URL, ALLOWED_ORIGINS } from "./src/config/index.js";
import Database from "./src/config/database.js";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import router from "./src/routes/index.js";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Update CORS options to accept multiple origins
var corsOptions = {
  origin: [
    'http://localhost:3001',
    'http://localhost:3002',
    'http://192.168.29.186:8082',
    'http://localhost:8082'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Access-Control-Allow-Origin'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Remove duplicate CORS middleware
app.use(cors(corsOptions));
moment.tz.setDefault("Asia/Kolkata");
Database();
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.status(401).send({ status: false, message: "Invalid Credentials" });
});
global.appRoot = path.resolve(__dirname);

// Remove this duplicate CORS call
// app.use(cors(corsOptions));

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

// Update CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});
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

// app.listen(APP_PORT || 8082, () => {
//   console.log(`Server running on PORT ${APP_PORT}`);
// });

app.listen(8082, () => {
  console.log("Server running on PORT 8082");
});
