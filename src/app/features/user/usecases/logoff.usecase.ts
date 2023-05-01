import { CacheRepository } from "../../../shared/database/repositories/cache.repositories";
import { Return } from "../../../shared/util/return.contract";
import { UserRepository } from "../database/user.repository";
import { LogoffUserParams } from "./types";

export class LogoffUserUsecase {
  public async execute(data: LogoffUserParams): Promise<Return> {
    const cacheRepository = new CacheRepository();
    const repository = new UserRepository();

    const result = await repository.logoff(data.id, data.status);
    await cacheRepository.delete("allUser");

    return {
      ok: true,
      code: 200,
      message: "Altorized logoff",
      data: result,
    };
  }
}
