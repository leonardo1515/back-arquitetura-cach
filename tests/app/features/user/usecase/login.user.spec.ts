import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { LoginUserUsecase } from "../../../../../src/app/features/user/usecases/login.usecase";
import { User } from "../../../../../src/app/models/user.models";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
describe("Login user usecase ", () => {
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
    return new LoginUserUsecase();
  };
  const data = {
    email: "any_email",
    password: "any_passwrod",
  };

  const login = {
    name: "any_name",
    email: "any_email",
    password: "any_password",
    status: false,
  };

  test("Deve retornar code 404 caso não encontre numguem com o email passado", async () => {
    jest.spyOn(UserRepository.prototype, "getByEmail").mockResolvedValue(null);

    const sut = makeSut();
    const result = await sut.execute(data);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("code", 404);
    expect(result).toHaveProperty("message", "User not found");
  });

  test("Deve retornar 401 caso tenha um usuario com o email mas a senha estaja errada", async () => {
    jest
      .spyOn(UserRepository.prototype, "getByEmail")
      .mockResolvedValue(
        new User(login.name, login.email, login.password, login.status)
      );
    jest.spyOn(UserRepository.prototype, "login").mockResolvedValue(null);

    const sut = makeSut();
    const result = await sut.execute(data);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("code", 401);
    expect(result).toHaveProperty("message", "Unauthorized access");
  });

  test("Deve retornar 200 caso o usecase de sucesso", async () => {
    jest
      .spyOn(UserRepository.prototype, "getByEmail")
      .mockResolvedValue(
        new User(login.name, login.email, login.password, login.status)
      );
    jest
      .spyOn(UserRepository.prototype, "login")
      .mockResolvedValue(
        new User(login.name, login.email, login.password, login.status)
      );

    const sut = makeSut();
    const result = await sut.execute(data);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 200);
    expect(result).toHaveProperty("message", "Altorized access");
  });
});
