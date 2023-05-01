import { Messages } from "../../../models/messages.models";
import { CacheRepository } from "../../../shared/database/repositories/cache.repositories";
import { Return } from "../../../shared/util/return.contract";
import { UserRepository } from "../../user/database/user.repository";
import { MessagesDatabase } from "../database/message";
import { CreateMessageParams } from "./types";

export class CreateMessageUsecase {
  public async execute(data: CreateMessageParams): Promise<Return> {
    const userRepository = new UserRepository();

    const user = await userRepository.getById(data.id);

    if (user === null) {
      return {
        ok: false,
        code: 404,
        message: "User not found",
      };
    }

    const repository = new MessagesDatabase();
    const result = await repository.create(
      data.id,
      new Messages(data.message, data.descript, data.status)
    );

    const cacheRepository = new CacheRepository();
    await cacheRepository.delete(`getMessageKey${data.id}`);
    await cacheRepository.delete("allUser");

    return {
      ok: true,
      code: 201,
      message: "New message successfully created",
      data: result,
    };
  }
}
