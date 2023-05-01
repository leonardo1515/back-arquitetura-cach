import { TypeormConnection } from "../../../../main/database/typeorm.connection";
import { Messages } from "../../../models/messages.models";
import { MessageEntity } from "../../../shared/database/entities/message.entity";

export class MessagesDatabase {
  private repository =
    TypeormConnection.connection.getRepository(MessageEntity);

  public static mapEntityToModel(entity: MessageEntity): Messages {
    return Messages.create(
      entity.id,
      entity.message,
      entity.descript,
      entity.status
    );
  }

  public async getById(id: string): Promise<Messages | null> {
    const result = await this.repository.findOneBy({
      id,
    });
    if (result === null) {
      return null;
    }

    return MessagesDatabase.mapEntityToModel(result);
  }

  public async getMessage(idUser: string): Promise<Messages[]> {
    const result = await this.repository.findBy({
      idUser,
    });
    return result.map((item) => MessagesDatabase.mapEntityToModel(item));
  }

  public async create(id: string, message: Messages): Promise<Messages> {
    const messageEntity = this.repository.create({
      id: message.id,
      message: message.message,
      descript: message.descript,
      status: false,
      idUser: id,
    });

    const result = await this.repository.save(messageEntity);
    return MessagesDatabase.mapEntityToModel(result);
  }

  public async update(
    id: string,
    message: string,
    descript: string,
    status: boolean
  ): Promise<number> {
    const result = await this.repository.update(
      {
        id,
      },
      {
        message,
        descript,
        status,
        atUpdate: new Date(),
      }
    );

    return result.affected ?? 0;
  }

  public async save(id: string, status: boolean): Promise<number> {
    const result = await this.repository.update(
      {
        id,
      },
      {
        status,
        atUpdate: new Date(),
      }
    );

    return result.affected ?? 0;
  }

  public async delete(id: string): Promise<number> {
    const result = await this.repository.delete({
      id,
    });

    return result.affected ?? 0;
  }
}
