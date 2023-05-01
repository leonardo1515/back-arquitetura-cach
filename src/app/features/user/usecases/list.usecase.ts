import { UserRepository } from "../database/user.repository";
import { Return } from "../../../shared/util/return.contract";
import { CacheRepository } from "../../../shared/database/repositories/cache.repositories";

const userListKey = "allUser";

export class ListUserUsecase {
  public async execute(email: string): Promise<Return> {
    const cachrepository = new CacheRepository();
    const cacheResult = await cachrepository.get<any>(userListKey);

    if (cacheResult !== null) {
      return {
        ok: true,
        code: 200,
        message: "All users successfully obted",
        data: cacheResult,
      };
    }

    const repository = new UserRepository();

    const result = await repository.list(email);

    await cachrepository.setEx(userListKey, result, 600);

    return {
      ok: true,
      code: 200,
      message: "All users successfully obted",
      data: result,
    };
  }
}
