import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { GetMessagesUsecase } from "../../../../../src/app/features/message/usecases/get.usecase";
import { MessagesDatabase } from "../../../../../src/app/features/message/database/message";
import { Messages } from "../../../../../src/app/models/messages.models";

describe("Get messagems usecase unit", () => {
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
    return new GetMessagesUsecase();
  };
  //   const mess = {
  //     userId: "c56984a8-45a3-4b09-a126-3e8006e946c9",

  //   };
  const mensagePop: Messages[] = [new Messages("nomee", "descript", false)];
  const mensage: Messages[] = [];

  test.skip("Deve retornar 200 o use case seja executado", async () => {
    jest
      .spyOn(MessagesDatabase.prototype, "getMessage")
      .mockResolvedValue(mensage);

    const sut = makeSut();
    const result = await sut.execute("c56984a8-45a3-4b09-a126-3e8006e946c9");

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 200);
    expect(result).toHaveProperty("message", "Messages not found");
  });

  test("Deve retornar 200 sejá encontrado mensagems para este usuario", async () => {
    jest
      .spyOn(MessagesDatabase.prototype, "getMessage")
      .mockResolvedValue(mensagePop);

    const sut = makeSut();
    const result = await sut.execute("c56984a8-45a3-4b09-a126-3e8006e946c9");

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 200);
    expect(result).toHaveProperty("message", "All messages sucecesfull obted");
  });
});
