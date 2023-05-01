import { CacheRepository } from "../../../shared/database/repositories/cache.repositories";
import { Return } from "../../../shared/util/return.contract";
import { MessagesDatabase } from "../database/message";
import { DeleteMessageParams } from "./types";

export class DeleteMessageUsecase {
  public async execute(data: DeleteMessageParams): Promise<Return> {
    const repository = new MessagesDatabase();

    const message = await repository.getById(data.id);

    if (message === null) {
      return {
        ok: false,
        code: 404,
        message: "Message not found",
      };
    }

    const result = await repository.delete(data.id);
    const cacheRepository = new CacheRepository();
    await cacheRepository.delete(`getMessageKey${data.userId}`);
    await cacheRepository.delete("allUser");

    return {
      ok: true,
      code: 200,
      message: "Message successfully edited",
      data: result,
    };
  }
}
