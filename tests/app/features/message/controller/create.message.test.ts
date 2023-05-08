import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";
import { createApp } from "../../../../../src/main/config/express.config";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import request from "supertest";

describe("Criando mendagem controller", () => {
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
      .post("/user//message/create")
      .send({ message: "any_message", descript: "any_decript", status: false });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result.body).toBeDefined();
    expect(result.body).toHaveProperty("message", "Id was not provided!");
  });

  test("Deve rotornar 400 se a message não for passado  ", async () => {
    const result = await request(app)
      .post("/user/c56984a8-45a3-4b09-a126-3e8006e946c9/message/create")
      .send({ descript: "any_descript", status: false });
    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty("body.message", "Message was not provided!");
  });

  test("Deveria retornar 400 quando o length da message for menor que 4", async () => {
    const result = await request(app)
      .post("/user/c56984a8-45a3-4b09-a126-3e8006e946c9/message/create")
      .send({ message: "any", descript: "any_descript", status: false });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty(
      "body.message",
      "message must be at least 4 characters long"
    );
  });

  test("Deve rotornar 400 se a descript não for passado  ", async () => {
    const result = await request(app)
      .post("/user/c56984a8-45a3-4b09-a126-3e8006e946c9/message/create")
      .send({ message: "any_message", status: false });
    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty("body.message", "Descript was not provided!");
  });

  test("Deveria retornar 400 quando o length da descript for menor que 4", async () => {
    const result = await request(app)
      .post("/user/c56984a8-45a3-4b09-a126-3e8006e946c9/message/create")
      .send({ message: "any_message", descript: "any", status: false });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty(
      "body.message",
      "descript must be at least 4 characters long"
    );
  });

  test.skip("Deve retornar 404 caso não encontre ninguem com o id", async () => {
    // jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(null);

    const result = await request(app)
      .post("/user/c56984a8-45a3-4b09-a126-3e8006e946c9/message/create")
      .send({ message: "any_message", descript: "any_decript", status: false });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 500);
    expect(result.body).toHaveProperty("message", "User not found");
  });

  test.skip("Deve retornar 201 caso a mensagem seja criada", async () => {
    await TypeormConnection.connection.getRepository(UserEntity).clear();

    const user = await request(app).post("/user/create").send({
      name: "any_name",
      email: "any_email",
      password: "any_password",
      id: "c56984a8-45a3-4b09-a126-3e8006e946c9",
      status: false,
    });

    const result = await request(app)
      .post("/user/c56984a8-45a3-4b09-a126-3e8006e946c9/message/create")
      .send({ message: "any_message", descript: "any_decript", status: false });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("statusCode", 201);
    expect(result.body).toHaveProperty(
      "message",
      "New message successfully created"
    );
  });
});
