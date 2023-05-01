import { Redis } from "ioredis";
import { redisConfig } from "../config/redis.config";

export class RedisConnection {
  private static _connection: Redis;

  public static async connect() {
    this._connection = new Redis(redisConfig);
    console.log("Reides starter");
  }

  public static get connection() {
    if (!this._connection) {
      throw new Error("db not connected");
    }
    return this._connection;
  }
}
