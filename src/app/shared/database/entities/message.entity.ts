import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

@Entity({
  name: "message",
})
export class MessageEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public message: string;

  @Column()
  public descript: string;

  @Column({
    default: false,
  })
  public status: boolean;

  @Column({
    type: "uuid",
    name: "id_usuario",
  })
  public idUser: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: "id_usuario",
  })
  user: UserEntity;

  @CreateDateColumn({
    name: "at_created",
  })
  public atCreate: Date;

  @UpdateDateColumn({
    name: "at_update",
  })
  public atUpdate: Date;
}
