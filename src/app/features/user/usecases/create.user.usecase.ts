import { UserRepository } from "../database/user.repository";
import { Return } from "../../../shared/util/return.contract";
import { User } from "../../../models/user.models";
import { CreateUserParams } from "./types";
import { CacheRepository } from "../../../shared/database/repositories/cache.repositories";

export class CreateUserUsecase {
  // constructor(
  //   private repository = new UserRepository(),
  //   private cacheRepository = new CacheRepository()
  // ) {}
  public async execute(data: CreateUserParams): Promise<Return> {
    const repository = new UserRepository();
    const user = await repository.getByEmail(data.email);

    if (user !== null) {
      return {
        ok: false,
        code: 400,
        message: "User already existing",
      };
    }

    const newUser = new User(
      data.name,
      data.email,
      data.password,
      data.status,
      data.id
    );

    const result = await repository.create(newUser);
    const cacheRepository = new CacheRepository();
    await cacheRepository.delete("allUser");

    return {
      ok: true,
      code: 201,
      message: "New user successfully created",
      data: result,
    };
  }
}
