import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { DeleteUsecase } from "../../../../../src/app/features/user/usecases/delete.usecase";
import { User } from "../../../../../src/app/models/user.models";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";

describe("Delete use usecase unit", () => {
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
    return new DeleteUsecase();
  };
  const data = {
    email: "any_email",
    password: "any_passwrod",
    id: "c56984a8-45a3-4b09-a126-3e8006e946c9",
  };

  const del = [new User("any_name", "any_email", "any_password", false)];

  test("Deve retornar 400 caso não encontre usuario com o id passado", async () => {
    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(null);

    const sut = makeSut();
    const result = await sut.execute(data);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("code", 404);
    expect(result).toHaveProperty("message", "User not found");
  });

  test("Deve retornar 400 caso não encontre usuario com o id passado", async () => {
    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(null);

    const sut = makeSut();
    const result = await sut.execute(data);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("code", 404);
    expect(result).toHaveProperty("message", "User not found");
  });

  test("Deve retornar 200 caso o uuario seja deletado", async () => {
    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(del);

    const sut = makeSut();
    const result = await sut.execute(data);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 200);
    expect(result).toHaveProperty("message", "User successfully deleted");
  });
});
