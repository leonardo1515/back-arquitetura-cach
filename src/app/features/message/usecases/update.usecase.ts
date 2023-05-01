import { CacheRepository } from "../../../shared/database/repositories/cache.repositories";
import { Return } from "../../../shared/util/return.contract";
import { MessagesDatabase } from "../database/message";
import { UpdateMessageParams } from "./types";

export class UpdateMessageUsecase {
  public async execute(data: UpdateMessageParams): Promise<Return> {
    const repository = new MessagesDatabase();
    const message = await repository.getById(data.id);

    if (message === null) {
      return {
        ok: false,
        code: 404,
        message: "Message not found",
      };
    }

    const result = await repository.update(
      data.id,
      data.message,
      data.descript,
      data.status
    );

    const cacheRepository = new CacheRepository();
    await cacheRepository.delete(`getMessageKey${data.userId}`);
    await cacheRepository.delete("allUser");

    return {
      ok: false,
      code: 201,
      message: "Message successfully edited",
      data: result,
    };
  }
}
