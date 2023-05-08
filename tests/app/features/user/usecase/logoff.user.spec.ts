import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { LogoffUserUsecase } from "../../../../../src/app/features/user/usecases/logoff.usecase";
import { User } from "../../../../../src/app/models/user.models";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";

describe("Logoff user unit usecase", () => {
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
    return new LogoffUserUsecase();
  };

  const data = {
    id: "c56984a8-45a3-4b09-a126-3e8006e946c9",
    status: false,
  };

  test("Deve retornar 200 caso o logoff seja feito con sucesso", async () => {
    jest.spyOn(UserRepository.prototype, "logoff").mockResolvedValue(1);

    const sut = makeSut();
    const result = await sut.execute(data);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 200);
    expect(result).toHaveProperty("message", "Altorized logoff");
  });
});
