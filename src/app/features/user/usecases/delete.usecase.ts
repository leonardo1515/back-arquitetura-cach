import { CacheRepository } from "../../../shared/database/repositories/cache.repositories";
import { Return } from "../../../shared/util/return.contract";
import { UserRepository } from "../database/user.repository";
import { DeleteUserParams } from "./types";

export class DeleteUsecase {
  public async execute(data: DeleteUserParams): Promise<Return> {
    const repository = new UserRepository();
    const user = await repository.getById(data.id);

    if (user === null) {
      return {
        ok: false,
        code: 404,
        message: "User not found",
      };
    }

    const result = await repository.delete(data.id);
    const cacheRepository = new CacheRepository();
    await cacheRepository.delete("allUser");
    await cacheRepository.delete(`loginUserKey${data.email}`);
    return {
      ok: true,
      code: 200,
      message: "User successfully deleted",
      data: result,
    };
  }
}
