import { UserRepository } from "../database/user.repository";
import { Return } from "../../../shared/util/return.contract";
import { LoginUserParams } from "./types";
import { CacheRepository } from "../../../shared/database/repositories/cache.repositories";
import { SaveUserUsecase } from "./save.usecase";

export class LoginUserUsecase {
  public async execute(data: LoginUserParams): Promise<Return> {
    const cacheRepository = new CacheRepository();

    const cacheResult = await cacheRepository.get(`loginUserKey${data.email}`);

    if (cacheResult !== null) {
      return {
        ok: true,
        code: 200,
        message: "Altorized access",
        data: cacheResult,
      };
    }
    const repository = new UserRepository();
    const user = await repository.getByEmail(data.email);

    if (user === null) {
      return {
        ok: false,
        code: 404,
        message: "User not found",
      };
    }

    const result = await repository.login(data.email, data.password);

    if (result === null) {
      return {
        ok: false,
        code: 401,
        message: "Unauthorized access",
      };
    }

    const usecaseSave = new SaveUserUsecase();
    const dataSave = {
      id: result.id,
      status: true,
    };
    result.status = true;
    await usecaseSave.execute(dataSave);
    // await cacheRepository.setEx(`loginUserKey${data.email}`, result,3600);
    return {
      ok: true,
      code: 200,
      message: "Altorized access",
      data: result.toJson(),
    };
  }
}
