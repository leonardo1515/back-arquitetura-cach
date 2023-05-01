import { Return } from "../../../shared/util/return.contract";
import { UserRepository } from "../database/user.repository";
import { SaveUserParams } from "./types";

export class SaveUserUsecase {
  public async execute(data: SaveUserParams): Promise<Return> {
    const repository = new UserRepository();
    const result = repository.save(data.id, data.status);

    return {
      ok: false,
      code: 201,
      message: "User successfully edited",
      data: result,
    };
  }
}
