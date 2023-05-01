import { NextFunction, Request, Response } from "express";
import { RequestError } from "../../errors/request.error";
import { ApiError } from "../../errors/api.error";

export class CreateUserValidatorMiddleware {
  public static createValidator(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password } = req.body;

      if (!email) {
        return RequestError.fieldNotProvided(res, "Email");
      }

      if (email.length < 4) {
        return RequestError.lengthError(
          res,
          "email must be at least 4 characters long"
        );
      }

      if (!password) {
        return RequestError.fieldNotProvided(res, "Password");
      }

      if (password.length < 4) {
        return RequestError.lengthError(
          res,
          "password must be at least 4 characters long"
        );
      }

      next();
    } catch (error: any) {
      return ApiError.serverError(res, error);
    }
  }
}
