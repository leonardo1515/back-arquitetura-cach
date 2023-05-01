import jwt from "jsonwebtoken";
import { authEnv } from "../../envs/auth.envs";

export class JwtAdapter {
  public static createToken(data: any) {
    return jwt.sign(JSON.stringify(data), authEnv.secret!);
  }
}
