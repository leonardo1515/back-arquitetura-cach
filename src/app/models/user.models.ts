import { v4 as createUuid } from "uuid";
import { Messages } from "./messages.models";

export class User {
  // private _id: string;
  // private _messages?: Messages[];
  // private _status: boolean;
  constructor(
    private _name: string,
    private _email: string,
    private _password: string,
    private _status?: boolean,
    private _id?: string,
    private _messages?: Messages[]
  ) {
    this._id = createUuid();
    // this._messages = [];
    // this._status = false;
  }

  public get email() {
    return this._email;
  }

  public get password() {
    return this._password;
  }

  public get name() {
    return this._name;
  }

  public get id() {
    return this._id;
  }

  public get message() {
    return this._messages ?? [];
  }

  public get status() {
    return this._status ?? false;
  }

  public set message(message: Messages[]) {
    this._messages = message;
  }

  public set password(password: string) {
    this._password = password;
  }

  public set name(name: string) {
    this._name = name;
  }

  public set email(email: string) {
    this._email = email;
  }

  public set status(status: boolean) {
    this._status = status;
  }

  public toJson() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      password: this._password,
      status: this._status,
      message: this._messages,
    };
  }

  public static create(
    name: string,
    email: string,
    password: string,
    status: boolean,
    id: string,
    message: Messages[]
  ) {
    const user = new User(name, email, password, status, id, message);
    user._id = id;

    return user;
  }
}
