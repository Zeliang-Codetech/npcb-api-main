import dotenv from "dotenv";
dotenv.config();
export const {
  APP_PORT,
  APP_URL,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  DEBUG_MODE,
  ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [
        'http://localhost:3001',
        'http://192.168.29.186:8082',
        'http://localhost:8082'
      ]
} = process.env;
