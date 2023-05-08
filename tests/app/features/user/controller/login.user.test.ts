import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { LoginUserUsecase } from "../../../../../src/app/features/user/usecases/login.usecase";
import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { createApp } from "../../../../../src/main/config/express.config";
import request from "supertest";
import { UserEntity } from "../../../../../src/app/shared/database/entities/user.entity";

describe("Login controller unit teste", () => {
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

  test("Deve retornar 400 se não for passado Email", async () => {
    const result = await request(app).post("/user/login").send({});

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty("body.message", "Email was not provided!");
  });

  test("Deve retornar 400 se não for passado Password", async () => {
    const result = await request(app)
      .post("/user/login")
      .send({ email: "anyteste@gmail.com" });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("statusCode", 400);
    expect(result).toHaveProperty("body.message", "Password was not provided!");
  });

  test("Deve retornar 404 caso não encontre nimguem com o email provido", async () => {
    jest.spyOn(UserRepository.prototype, "getByEmail").mockResolvedValue(null);
    jest
      .spyOn(LoginUserUsecase.prototype, "execute")
      .mockResolvedValue({ ok: false, code: 404, message: "User not found" });

    const result = await request(app)
      .post("/user/login")
      .send({ email: "anyteste@gmail.com", password: "anypassword" });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result.statusCode).toBe(404);
    expect(result).toHaveProperty("body.message", "User not found");
  });

  test("Deve retornar 401 caso não encontre nimguem com o email e password valido", async () => {
    jest.spyOn(UserRepository.prototype, "login").mockResolvedValue(null);
    jest.spyOn(LoginUserUsecase.prototype, "execute").mockResolvedValue({
      ok: false,
      code: 401,
      message: "Unauthorized access",
    });

    const result = await request(app)
      .post("/user/login")
      .send({ email: "anyteste@gmail.com", password: "anypassword" });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result.statusCode).toBe(401);
    expect(result).toHaveProperty("body.message", "Unauthorized access");
  });

  test("Deve retornar 200 caso encontre um usuario com email e password iguais ", async () => {
    await TypeormConnection.connection.getRepository(UserEntity).clear();

    const user = await request(app).post("/user/create").send({
      name: "any_name",
      email: "any_email",
      password: "any_password",
      status: false,
    });

    const result = await request(app).post("/user/login").send({
      email: "any_email",
      password: "any_password",
    });

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result.statusCode).toBe(200);
    expect(result).toHaveProperty("body.message", "Altorized access");
  });
});
