import { UserRepository } from "../../../../../src/app/features/user/database/user.repository";
import { CreateMessageUsecase } from "../../../../../src/app/features/message/usecases/create.user";
import { User } from "../../../../../src/app/models/user.models";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { MessagesDatabase } from "../../../../../src/app/features/message/database/message";
import { Messages } from "../../../../../src/app/models/messages.models";
describe("Create message unit usecase", () => {
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
    return new CreateMessageUsecase();
  };
  const mess = {
    id: "c56984a8-45a3-4b09-a126-3e8006e946c9",
    message: "any_mesnsagem",
    descript: "any_descript",
    status: false,
  };

  const user = [new User("any_name", "any_email", "any_password", false)];

  test("Deve retornar 404 caso não encontre usuario com o id passado", async () => {
    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(null);

    const sut = makeSut();
    const result = await sut.execute(mess);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("code", 404);
    expect(result).toHaveProperty("message", "User not found");
  });

  test.skip("Deve retornar 201 caso seja criado uma mensagem", async () => {
    jest.spyOn(UserRepository.prototype, "getById").mockResolvedValue(user);
    // jest.spyOn(MessagesDatabase.prototype, "create").mockResolvedValue(mess);

    const sut = makeSut();
    const result = await sut.execute(mess);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 201);
    expect(result).toHaveProperty(
      "message",
      "New message successfully created"
    );
  });
});
