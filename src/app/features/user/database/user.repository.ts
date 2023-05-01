import { TypeormConnection } from "../../../../main/database/typeorm.connection";
import { MessagesDatabase } from "../../message/database/message";
import { User } from "../../../models/user.models";
import { UserEntity } from "../../../shared/database/entities/user.entity";

export class UserRepository {
  private repository = TypeormConnection.connection.getRepository(UserEntity);

  private mapEntityToModel(entity: UserEntity): User {
    const userEntity = entity.message ?? [];
    const message = userEntity.map((item) =>
      MessagesDatabase.mapEntityToModel(item)
    );

    return User.create(
      entity.name,
      entity.email,
      entity.password,
      entity.status,
      entity.id,
      message
    );
  }

  public async list(email?: string): Promise<User[]> {
    const result = await this.repository.find({
      relations: ["message"],
    });

    return result.map((user) => this.mapEntityToModel(user));
  }

  public async getById(id: string): Promise<User[] | null> {
    // const result = await this.repository.findOneBy({
    //   id,
    // });
    const result = await this.repository.find({
      relations: ["message"],
    });

    if (result === null) {
      return null;
    }
    return result.map((user) => this.mapEntityToModel(user));

    // return this.mapEntityToModel(result);
  }

  public async getByEmail(email: string): Promise<User | null> {
    const result = await this.repository.findOneBy({
      email,
    });

    if (result === null) {
      return null;
    }

    return this.mapEntityToModel(result);
  }

  public async create(user: User): Promise<User> {
    const userEntily = this.repository.create({
      name: user.name,
      email: user.email,
      password: user.password,
      status: false,
      id: user.id,
    });

    const result = await this.repository.save(userEntily);
    return this.mapEntityToModel(result);
  }

  public async login(email: string, password: string): Promise<User | null> {
    const result = await this.repository.findOne({
      where: { email, password },
      relations: ["message"],
    });

    if (result === null) {
      return null;
    }

    return this.mapEntityToModel(result);
  }

  public async save(id: string | undefined, status: boolean): Promise<number> {
    const result = await this.repository.update(
      {
        id,
      },
      {
        status,
      }
    );

    return result.affected ?? 0;
  }

  public async update(
    id: string,
    name: string,
    password: string
  ): Promise<number> {
    const result = await this.repository.update(
      {
        id,
      },
      {
        name,
        password,
        atUpdate: new Date(),
      }
    );
    return result.affected ?? 0;
  }

  public async logoff(id: string, status: boolean): Promise<number> {
    const result = await this.repository.update(
      {
        id,
      },
      {
        status,
        // atUpdate: new Date(),
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
