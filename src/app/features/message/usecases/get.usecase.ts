import { CacheRepository } from "../../../shared/database/repositories/cache.repositories";
import { MessagesDatabase } from "../database/message";

export class GetMessagesUsecase {
  public async execute(userId: string) {
    const cacheRepository = new CacheRepository();
    const cacheResult = await cacheRepository.get(`getMessageKey${userId}`);

    if (cacheResult !== null) {
      return {
        ok: true,
        code: 200,
        message: "All messages sucecesfull obted",
        data: cacheResult,
      };
    }
    const repository = new MessagesDatabase();

    const result = await repository.getMessage(userId);
    await cacheRepository.setEx(`getMessageKey${userId}`, result, 3600);

    if (!result) {
      return {
        ok: true,
        code: 200,
        message: "Messages not found",
        data: result,
      };
    }

    return {
      ok: true,
      code: 200,
      message: "All messages sucecesfull obted",
      data: result,
    };
  }
}
