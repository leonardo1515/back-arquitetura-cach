import { Router } from "express";
import { UserController } from "../controller/user.controller";
import {
  CreateUserValidatorMiddleware,
  LoginValidatorMiddleware,
  ProviderIdMiddlewareValidator,
  UpdateUserValidatorMiddleware,
} from "../../../shared/middlewares/index";

export const userRoutes = () => {
  const app = Router();
  app.get("/", new UserController().list);

  app.post(
    "/login",
    LoginValidatorMiddleware.loginValidator,
    new UserController().login
  );
  app.post(
    "/create",
    CreateUserValidatorMiddleware.createValidator,
    new UserController().create
  );
  app.put(
    "/:id/update",
    ProviderIdMiddlewareValidator.idProvider,
    UpdateUserValidatorMiddleware.updateValidator,
    new UserController().update
  );

  app.put(
    "/:id/logoff",
    ProviderIdMiddlewareValidator.idProvider,
    new UserController().logoff
  );

  app.delete(
    "/:id/delete",
    ProviderIdMiddlewareValidator.idProvider,
    new UserController().delete
  );
  return app;
};
