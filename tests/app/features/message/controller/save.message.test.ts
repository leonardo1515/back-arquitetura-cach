import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { createApp } from "../../../../../src/main/config/express.config";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import request from "supertest";

describe("Save message controller", () => {
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

  test.skip("Deve retornar 400 se o id não for privido", async () => {
    const result = await request(app)
      .put("/user//messages/5555555555/save")
      .send();

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result.body).toBeDefined();
    expect(result.body).toHaveProperty("message", "Id was not provided!");
  });

  test.skip("Deve rotornar 400 se a message não for passado  ", async () => {
    const result = await request(app)
      .put("/user//messages//save")
      .send({ descript: "any_descript", status: false });
    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 404);
    expect(result.body).toHaveProperty("message", "Message was not provided!");
  });

  test.skip("Deve rotornar 400 se a descript não for passado  ", async () => {
    const result = await request(app)
      .put(
        "/user/53719cfb-b6b7-4a18-b501-443b57129bac/messages/c56984a8-45a3-4b09-a126-3e8006e946c9/update"
      )
      .send({ message: "any_message", status: false });
    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty("body.message", "Descript was not provided!");
  });

  test.skip("Deve retornar 404 caso não encontre ninguem com o id", async () => {
    await TypeormConnection.connection.getRepository(UserEntity).clear();

    const result = await request(app)
      .put(
        "/user/53719cfb-b6b7-4a18-b501-443b57129bac/messages/c56984a8-45a3-4b09-a126-3e8006e946c9/update"
      )
      .send({ message: "any_message", descript: "any_decript", status: false });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("statusCode", 404);
    expect(result.body).toHaveProperty("message", "User not found");
  });
});
