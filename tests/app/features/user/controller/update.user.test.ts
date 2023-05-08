import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import { UpdateUserUsecase } from "../../../../../src/app/features/user/usecases/update.user.usecase";
import request from "supertest";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { User } from "../../../../../src/app/models/user.models";

describe("Update user controller", () => {
  beforeAll(async () => {
    await TypeormConnection.connect();
    await RedisConnection.connect();
  });

  afterAll(async () => {
    await TypeormConnection.connection.destroy();
    await RedisConnection.connection.quit();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    await TypeormConnection.connection.getRepository(UserEntity).clear();
  });

  const app = createApp();

  test("Deve retosrna 400 caso um id não seja provido", async () => {
    const result = await request(app).put("/user/:id/update").send({});

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result.body).toBeDefined();
    // expect(result).toHaveProperty("body.message", "Id was not provided!");
  });

  test.skip("Deve retornar 404  caso não encontre nimguem com o id ", async () => {
    jest.spyOn(UpdateUserUsecase.prototype, "execute").mockResolvedValue({
      ok: false,
      code: 404,
      message: "User not found",
    });

    const result = await request(app)
      .put("/user/c56984a8-45a3-4b09-a126-3e8006e946c9/update")
      .send();
    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result.statusCode).toBe(404);
    expect(result.body).toBeDefined();
  });

  test("Deve retornar 400 caso o email e password não seja providos", async () => {
    const result = await request(app)
      .put("/user/:id/update")
      .send({ id: "c56984a8-45a3-4b09-a126-3e8006e946c9" });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty(
      "body.message",
      "Name and password was not provided!"
    );
  });

  test("Deve retornar 400 caso o password tenha sido passado e so o length fom menor que 4", async () => {
    const result = await request(app)
      .put("/user/:id/update")
      .send({ id: "c56984a8-45a3-4b09-a126-3e8006e946c9", password: "444" });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty(
      "body.message",
      "password must be at least 4 characters long"
    );
  });

  test("Deve retornar 201 caso o usuario seja editado ", async () => {
    await TypeormConnection.connection.getRepository(UserEntity).clear();

    const user = await request(app).post("/user/create").send({
      name: "any_namekkkkk",
      email: "any_email",
      password: "any_password",
      id: "c56984a8-45a3-4b09-a126-3e8006e946c9",
      status: false,
    });

    const result = await request(app)
      .put("/user/c56984a8-45a3-4b09-a126-3e8006e946c9/update")
      .send({ password: "44444" });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result.statusCode).toBe(201);
    expect(result.body).toBeDefined();
    expect(result.body).toHaveProperty("message", "User successfully edited");
  });
});
