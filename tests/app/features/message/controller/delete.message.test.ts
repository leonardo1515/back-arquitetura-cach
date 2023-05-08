import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { createApp } from "../../../../../src/main/config/express.config";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import request from "supertest";

describe("Delete message controller", () => {
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

  test.skip("Deve retornar 404 caso não encontre ninguem com o id", async () => {
    // jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(null);
    await TypeormConnection.connection.getRepository(UserEntity).clear();

    const result = await request(app)
      .delete(
        "/user/53719cfb-b6b7-4a18-b501-443b57129bac/messages/c56984a8-45a3-4b09-a126-3e8006e946c9/delete"
      )
      .send();

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("statusCode", 404);
    expect(result.body).toHaveProperty("message", "User not found");
  });

  test.skip("Deve retornar 201 caso a mensagem seja edotada con sucesso", async () => {
    await TypeormConnection.connection.getRepository(UserEntity).clear();
    const user = await request(app).post("/user/create").send({
      name: "anyleonardo200",
      email: "any@gmail.com",
      password: "any78455",
      status: false,
      id: "c56984a8-45a3-4b09-a126-3e8006e946c9",
    });

    const result = await request(app)
      .delete(
        "/user/53719cfb-b6b7-4a18-b501-443b57129bac/messages/c56984a8-45a3-4b09-a126-3e8006e946c9/delete"
      )
      .send();

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("statusCode", 200);
    expect(result.body).toHaveProperty("message", "User not found");
  });
});
