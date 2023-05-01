import { CacheRepository } from "../../../shared/database/repositories/cache.repositories";
import { Return } from "../../../shared/util/return.contract";
import { MessagesDatabase } from "../database/message";
import { SaveMessageParams } from "./types";

export class SaveMessageUsecase {
  public async execute(data: SaveMessageParams): Promise<Return> {
    const repository = new MessagesDatabase();

    const result = await repository.save(data.id, data.status);

    const cacheRepository = new CacheRepository();
    await cacheRepository.delete(`getMessageKey${data.userId}`);
    await cacheRepository.delete("allUser");

    return {
      ok: false,
      code: 201,
      message: "Message successfully saved",
      data: result,
    };
  }
}
