import { Request, Response } from "express";
import { CreateUserUsecase } from "../usecases/create.user.usecase";
import { ApiError } from "../../../shared/errors/api.error";
import { LoginUserUsecase } from "../usecases/login.usecase";
import { UpdateUserUsecase } from "../usecases/update.user.usecase";
import { LogoffUserUsecase } from "../usecases/logoff.usecase";
import { DeleteUsecase } from "../usecases/delete.usecase";
import { ListUserUsecase } from "../usecases/list.usecase";

export class UserController {
  public async list(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const usecase = new ListUserUsecase();
      const result = await usecase.execute(email);
      return res.status(result.code).send(result);
    } catch (error: any) {
      return ApiError.serverError(res, error);
    }
  }

  public async create(req: Request, res: Response) {
    try {
      const { name, email, id, password, status } = req.body;
      const usecase = new CreateUserUsecase();
      const result = await usecase.execute({
        name,
        email,
        password,
        status,
        id,
      });
      return res.status(result.code).send(result);
    } catch (error: any) {
      ApiError.serverError(res, error);
    }
  }

  public async login(req: Request, res: Response) {
    try {
      const { email, password, status } = req.body;
      const data = {
        email: email,
        password: password,
      };

      const usecase = new LoginUserUsecase();
      const result = await usecase.execute(data);
      return res.status(result.code).send(result);
    } catch (error: any) {
      ApiError.serverError(res, error);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, password, email } = req.body;
      const data = {
        id: id,
        name: name,
        password: password,
        email: email,
      };
      const usecase = new UpdateUserUsecase();
      const result = await usecase.execute(data);
      return res.status(result.code).send(result);
    } catch (error: any) {
      ApiError.serverError(res, error);
    }
  }

  public async logoff(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const data = {
        id: id,
        status: status,
      };
      const usecase = new LogoffUserUsecase();
      const result = await usecase.execute(data);
      return res.status(result.code).send(result);
    } catch (error: any) {
      ApiError.serverError(res, error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { email } = req.body;
      const data = {
        id: id,
        email: email,
      };
      const usecase = new DeleteUsecase();
      const result = await usecase.execute(data);
      return res.status(result.code).send(result);
    } catch (error: any) {
      ApiError.serverError(res, error);
    }
  }
}
