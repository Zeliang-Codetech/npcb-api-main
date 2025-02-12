import dotenv from "dotenv";
dotenv.config();
export const {
  APP_PORT,
  APP_URL,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  DEBUG_MODE,
} = process.env;
