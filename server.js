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
import https from 'https';
import fs from 'fs';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var corsOptions = {
  origin: [
    'http://localhost:3001',
    'http://localhost:3002',
    'http://192.168.29.186:8082',
    'http://localhost:8082',
    'https://npcb.in',
    'https://www.npcb.in',
    'https://backend.npcb.in'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

moment.tz.setDefault("Asia/Kolkata");
const startServer = async () => {
  try {
    // Initialize database connection
    await Database();
    
    // For development (Windows/Local environment)
    if (process.env.NODE_ENV === 'development') {
      app.listen(8082, () => {
        console.log("Server running on PORT 8082 (HTTP)");
      });
    } else {
      try {
        // For production with SSL (Linux environment)
        const httpsOptions = {
          cert: fs.readFileSync('/etc/letsencrypt/live/backend.npcb.in/fullchain.pem'),
          key: fs.readFileSync('/etc/letsencrypt/live/backend.npcb.in/privkey.pem')
        };
      
        // Use port 8443 for HTTPS
        https.createServer(httpsOptions, app).listen(8443, () => {
          console.log('HTTPS Server running on port 8443');
        });
      
        // Use port 8080 for HTTP
        const httpApp = express();
        httpApp.all('*', (req, res) => {
          res.redirect(`https://${req.hostname}${req.url}`);
        });
        httpApp.listen(8080);
      } catch (sslError) {
        console.error("SSL Certificate Error:", sslError.message);
        // Fallback to HTTP if SSL fails
        app.listen(8080, () => {
          console.log("Server running on PORT 8080 (HTTP) - SSL Failed");
        });
      }
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  res.status(401).send({ status: false, message: "Invalid Credentials" });
});
global.appRoot = path.resolve(__dirname);

app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));

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

startServer();
