import * as dotenv from "dotenv";
dotenv.config();

export const redisEnv = {
  host: process.env.REIDS_HOST,
  password: process.env.REIDS_PASS,
  username: process.env.REIDS_USER,
  port: process.env.REIDS_PORT,
};
