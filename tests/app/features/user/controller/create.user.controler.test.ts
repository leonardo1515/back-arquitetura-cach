import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import request from "supertest";

describe("Create controller unit teste", () => {
  beforeAll(async () => {
    await TypeormConnection.connect();
    await RedisConnection.connect();
  });

  afterAll(async () => {
    await TypeormConnection.connection.destroy();
    await RedisConnection.connection.quit();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  const app = createApp();

  test("Deveria retornar 400 quando não from passado um email", async () => {
    const result = await request(app).post("/user/create").send({});
    expect(result).toBeDefined();
    // expect(result).toHaveProperty("ok", false);
    expect(result.statusCode).toBe(400);
    // const res = await request(app).post("/user/create").send({
    //   name: "anyteste",
    //   email: "mais um teste",
    //   password: "tes4555",
    //   status: false,
    // });
    // expect(res).toBeDefined();
    // expect(res).toHaveProperty("code", 201);
  });
});
