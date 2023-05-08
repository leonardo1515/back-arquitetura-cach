import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { UpdateUserUsecase } from "../../../../../src/app/features/user/usecases/update.user.usecase";
import { User } from "../../../../../src/app/models/user.models";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";

describe("Update user unit usecase", () => {
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

  const makeSut = () => {
    return new UpdateUserUsecase();
  };
  const data = {
    name: "any_name",
    email: "any_email",
    password: "any_passwrod",
    id: "c56984a8-45a3-4b09-a126-3e8006e946c9",
  };

  const upd = [
    new User(
      "any_name",
      "any_email",
      "any_password",
      false,
      "c56984a8-45a3-4b09-a126-3e8006e946c9"
    ),
  ];

  test("Deve retornar 404 caso não seja encontrado nemum usuario com o id passado", async () => {
    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(null);

    const sut = makeSut();
    const result = await sut.execute(data);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("code", 404);
    expect(result).toHaveProperty("message", "User not found");
  });

  test("Deve retornar 201 caso o usuario seja editado", async () => {
    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(upd);
    jest.spyOn(UserRepository.prototype, "update").mockResolvedValue(1);

    const sut = makeSut();
    const result = await sut.execute(data);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 201);
    expect(result).toHaveProperty("message", "User successfully edited");
  });
});
