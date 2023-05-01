import { Router } from "express";
import {
  ProviderIdMiddlewareValidator,
  CreateMessageValidatorMiddleware,
  UpdateMessageValidatorMiddleware,
} from "../../../shared/middlewares/index";
import { MessagesController } from "../controller/messages.controller";

export const MessageRoutes = () => {
  const app = Router();
  app.get("/:id/messages/", new MessagesController().list);
  app.post(
    "/:id/message/create",
    ProviderIdMiddlewareValidator.idProvider,
    CreateMessageValidatorMiddleware.createMessageValidator,
    new MessagesController().create
  );

  app.put(
    "/:id/messages/:userId/update",
    ProviderIdMiddlewareValidator.idProvider,
    UpdateMessageValidatorMiddleware.updateValidator,
    new MessagesController().update
  );

  app.put(
    "/:id/messages/:userId/save",
    ProviderIdMiddlewareValidator.idProvider,
    new MessagesController().save
  );

  app.delete(
    "/:id/messages/:userId/delete",
    ProviderIdMiddlewareValidator.idProvider,
    new MessagesController().delete
  );

  return app;
};
