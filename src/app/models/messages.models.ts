import { v4 as createUuid } from "uuid";

export class Messages {
  private _id: string;
  // private _save: boolean;
  constructor(
    private _message: string,
    private _descript: string,
    private _status: boolean
  ) {
    this._id = createUuid();
    // this._save = false;
  }

  public get id() {
    return this._id;
  }

  public get message() {
    return this._message;
  }

  public get descript() {
    return this._descript;
  }

  public get status() {
    return this._status;
  }

  public set message(message: string) {
    this._message = message;
  }

  public set descript(descript: string) {
    this._descript = descript;
  }

  public set status(status: boolean) {
    this._status = status;
  }

  public toJson() {
    return {
      id: this._id,
      save: this._status,
      message: this._message,
      descript: this._descript,
    };
  }

  public static create(
    id: string,
    message: string,
    descript: string,
    status: boolean
  ) {
    const messages = new Messages(message, descript, status);
    messages._id = id;

    return messages;
  }
}
