import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { DeleteUsecase } from "../../../../../src/app/features/user/usecases/delete.usecase";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { createApp } from "../../../../../src/main/config/express.config";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import request from "supertest";

describe("Delete user Controller", () => {
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
    const result = await request(app).delete("/user/:id/delete").send({});

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result.body).toBeDefined();
    expect(result.body).toHaveProperty("message", "Id was not provided!");
  });

  test("Deve retornar 404  caso não encontre nimguem com o id ", async () => {
    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(null);
    jest.spyOn(DeleteUsecase.prototype, "execute").mockResolvedValue({
      ok: false,
      code: 404,
      message: "User not found",
    });

    const result = await request(app).delete("/user/4444/delete").send();

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result.statusCode).toBe(404);
    expect(result.body).toBeDefined();
    expect(result.body).toHaveProperty("message", "User not found");
  });

  test("Deve retornar 200  caso o usuario seja deletado  ", async () => {
    await TypeormConnection.connection.getRepository(UserEntity).clear();

    const user = await request(app).post("/user/create").send({
      name: "any_name",
      email: "any_email",
      password: "any_password",
      id: "c56984a8-45a3-4b09-a126-3e8006e946c9",
      status: false,
    });

    const result = await request(app)
      .delete("/user/:id/delete")
      .send({ id: "c56984a8-45a3-4b09-a126-3e8006e946c9" });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result.statusCode).toBe(200);
    expect(result).toHaveProperty("body.message", "User successfully deleted");
  });
});
