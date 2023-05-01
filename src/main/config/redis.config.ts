import { redisEnv } from "../../app/envs/redis.envs";

export const redisConfig = {
  host: redisEnv.host,
  password: redisEnv.password,
  username: redisEnv.username,
  port: Number(redisEnv.port),
};
