import { CacheRepository } from "../../../shared/database/repositories/cache.repositories";
import { Return } from "../../../shared/util/return.contract";
import { UserRepository } from "../database/user.repository";
import { UpdateUserParams } from "./types";

export class UpdateUserUsecase {
  public async execute(data: UpdateUserParams): Promise<Return> {
    const repository = new UserRepository();
    const user = await repository.getById(data.id);

    if (user === null) {
      return {
        ok: false,
        code: 404,
        message: "User not found",
      };
    }

    const result = await repository.update(data.id, data.name, data.password);
    const cacheRepository = new CacheRepository();
    await cacheRepository.delete("allUser");
    await cacheRepository.delete(`loginUserKey${data.email}`);

    return {
      ok: true,
      code: 201,
      message: "User successfully edited",
      data: result,
    };
  }
}
