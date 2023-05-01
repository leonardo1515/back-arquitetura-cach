import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { CreateUserUsecase } from "../../../../../src/app/features/user/usecases/create.user.usecase";
import { User } from "../../../../../src/app/models/user.models";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
describe("Create user usecase", () => {
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
    return new CreateUserUsecase();
  };
  const data = {
    name: "anyleonardo",
    email: "any@gmail.com",
    password: "any78455",
    status: false,
  };

  test("Deve retornar code 400 caso o usuario já exista", async () => {
    jest
      .spyOn(UserRepository.prototype, "getByEmail")
      .mockResolvedValue(
        new User(data.name, data.email, data.password, data.status)
      );
    jest.spyOn(UserRepository.prototype, "create");
    const sut = makeSut();

    const result = await sut.execute(data);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("code", 400);
    expect(result).toHaveProperty("message", "User already existing");
  });

  test("Deve retornar um novo usuario caso o email seja valido", async () => {
    jest.spyOn(UserRepository.prototype, "getByEmail").mockResolvedValue(null);
    jest
      .spyOn(UserRepository.prototype, "create")
      .mockResolvedValue(
        new User(data.name, data.email, data.password, data.status)
      );

    const sut = makeSut();

    const result = await sut.execute(data);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 201);
    expect(result).toHaveProperty("message", "New user successfully created");
  });
});

// describe("Create User usecase teste", () => {
//   const makeSut = () => {
//     return new CreateUserUsecase();
//   };

//   test("Testando a criação de usuariso", async () => {
//     const sut = makeSut();

//     const data = {
//       name: "deodonio",
//       email: "leodeosonio@gmail.com",
//       password: "toiii44",
//       status: false,
//     };
//     const result = await sut.execute(data);
//     expect(result).toBeDefined();
//     expect(result).toHaveProperty("ok", true);
//   });
// });
// npm rum:watch
