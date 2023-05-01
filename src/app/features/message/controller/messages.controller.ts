import { Request, Response } from "express";
import { ApiError } from "../../../shared/errors/api.error";
import { CreateMessageUsecase } from "../usecases/create.user";
import { UpdateMessageUsecase } from "../usecases/update.usecase";
import { SaveMessageUsecase } from "../usecases/save,usecase";
import { DeleteMessageUsecase } from "../usecases/delete.usecase";
import { GetMessagesUsecase } from "../usecases/get.usecase";

export class MessagesController {
  public async list(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const usecase = new GetMessagesUsecase();
      const result = await usecase.execute(id);
      return res.status(result.code).send(result);
    } catch (error: any) {
      return ApiError.serverError(res, error);
    }
  }
  public async create(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { message, descript, status } = req.body;
      const data = {
        id: id,
        message: message,
        descript: descript,
        status: status,
      };
      const usecase = new CreateMessageUsecase();
      const result = await usecase.execute(data);
      return res.status(result.code).send(result);
    } catch (error: any) {
      ApiError.serverError(res, error);
    }
  }
  public async update(req: Request, res: Response) {
    try {
      const { id, userId } = req.params;
      const { message, descript, status } = req.body;
      const data = {
        userId: userId,
        id: id,
        message: message,
        descript: descript,
        status: status,
      };
      const usecase = new UpdateMessageUsecase();
      const result = await usecase.execute(data);
      return res.status(result.code).send(result);
    } catch (error: any) {
      ApiError.serverError(res, error);
    }
  }
  public async save(req: Request, res: Response) {
    try {
      const { id, userId } = req.params;
      const { status } = req.body;
      const data = {
        userId: userId,
        id: id,
        status: status,
      };
      const usecase = new SaveMessageUsecase();
      const result = await usecase.execute(data);
      return res.status(result.code).send(result);
    } catch (error: any) {
      ApiError.serverError(res, error);
    }
  }
  public async delete(req: Request, res: Response) {
    try {
      const { id, userId } = req.params;
      const data = {
        userId: userId,
        id: id,
      };
      const usecase = new DeleteMessageUsecase();
      const result = await usecase.execute(data);
      return res.status(result.code).send(result);
    } catch (error: any) {
      ApiError.serverError(res, error);
    }
  }
}
