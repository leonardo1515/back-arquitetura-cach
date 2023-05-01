import { TypeormConnection } from "./main/database/typeorm.connection";
import { AppServer } from "./main/server/express.server";
import "reflect-metadata";

AppServer.run();
