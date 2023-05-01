import express from "express";
import cors from "cors";
import { userRoutes } from "../../app/features/user/routes/user.routes";
import { MessageRoutes } from "../../app/features/message/routes/message.routes";

export const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use("/user", userRoutes());

  app.use("/user", MessageRoutes());

  return app;
};
