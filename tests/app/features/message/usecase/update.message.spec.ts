import { User } from "../../../../../src/app/models/user.models";
import { RedisConnection } from "../../../../../src/main/database/redis.connection";
import { UpdateMessageUsecase } from "../../../../../src/app/features/message/usecases/update.usecase";
import { TypeormConnection } from "../../../../../src/main/database/typeorm.connection";
import { MessagesDatabase } from "../../../../../src/app/features/message/database/message";

describe("Update message usecase unit", () => {
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
    return new UpdateMessageUsecase();
  };
  const mess = {
    userId: "c56984a8-45a3-4b09-a126-3e8006e946c9",
    id: "d471e054-f4d5-4143-9e57-f3a53d54f094",
    message: "any_message",
    descript: "any_dscript",
    status: false,
  };

  test("Deve retornar 404 caso não encontre usuario com o id passado", async () => {
    jest.spyOn(MessagesDatabase.prototype, "getById").mockResolvedValue(null);

    const sut = makeSut();
    const result = await sut.execute(mess);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", false);
    expect(result).toHaveProperty("code", 404);
    expect(result).toHaveProperty("message", "Message not found");
  });

  test("Deve retornar 201 caso o usuario seja editado com sucesso", async () => {
    jest.spyOn(MessagesDatabase.prototype, "update").mockResolvedValue(1);

    const sut = makeSut();
    const result = await sut.execute(mess);

    expect(result).toBeDefined();
    expect(result).toHaveProperty("ok", true);
    expect(result).toHaveProperty("code", 201);
    expect(result).toHaveProperty("message", "Message successfully edited");
  });
});
