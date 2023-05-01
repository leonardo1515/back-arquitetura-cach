import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { MessageEntity } from "./message.entity";

@Entity({
  name: "user",
})
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({
    nullable: true,
    length: 30,
  })
  public name: string;

  @Column({
    unique: true,
  })
  public email: string;

  @Column()
  public password: string;

  @Column({
    default: false,
  })
  public status: boolean;

  @OneToMany(() => MessageEntity, (message) => message.user)
  message: MessageEntity[];

  @CreateDateColumn({
    name: "at_created",
  })
  public atCreate: Date;

  @UpdateDateColumn({
    name: "at_update",
  })
  public atUpdate: Date;
}
