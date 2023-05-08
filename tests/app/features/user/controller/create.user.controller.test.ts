import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { CreateUserUsecase } from "../../../../../src/app/features/user/usecases/create.user.usecase";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import request from "supertest";
import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { User } from "../../../../../src/app/models/user.models";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";

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

  test("Deve rotornar 400 se o email não for passado  ", async () => {
    const result = await request(app).post("/user/create").send({});

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty("body.message", "Email was not provided!");
  });

  test("Deveria retornar 400 quando o length do email for menor que 4", async () => {
    const result = await request(app)
      .post("/user/create")
      .send({ email: "444" });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty(
      "body.message",
      "email must be at least 4 characters long"
    );
  });

  test("Deve rotornar 400 se o password não for passado  ", async () => {
    const result = await request(app)
      .post("/user/create")
      .send({ email: "anyleonardo" });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty("body.message", "Password was not provided!");
  });

  test("Deveria retornar 400 quando o length do password for menor que 4", async () => {
    const result = await request(app)
      .post("/user/create")
      .send({ email: "anyleonardo", password: "333" });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty(
      "body.message",
      "password must be at least 4 characters long"
    );
  });

  test("Deveria retornar 400 quando from passado um email já existente", async () => {
    await TypeormConnection.connection.getRepository(UserEntity).clear();

    const user = await request(app).post("/user/create").send({
      name: "any_name400",
      email: "any_email",
      password: "any_password",
      status: false,
    });

    const result = await request(app).post("/user/create").send({
      name: "any_name",
      email: "any_email",
      password: "any_password",
      status: false,
    });
    expect(result).toBeDefined();
    expect(result.statusCode).toBe(400);
    expect(result).toHaveProperty("body.message", "User already existing");
  });

  test("Deve rotornar 201 quando from passado todos os parametros corretamente", async () => {
    jest.spyOn(UserRepository.prototype, "getByEmail").mockResolvedValue(null);

    await TypeormConnection.connection.getRepository(UserEntity).clear();

    const result = await request(app).post("/user/create").send({
      name: "anyleonardo200",
      email: "any@gmail.com",
      password: "any78455",
      status: false,
    });
    expect(result).toBeDefined();
    expect(result.statusCode).toBe(201);
    expect(result).toHaveProperty(
      "body.message",
      "New user successfully created"
    );
  });
});
