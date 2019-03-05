import { AbstractError} from "./abstract-error";

/** @class */
export class DatabaseError extends AbstractError {
  constructor(message) {
    super(message);
    this.name = 'Database Error';
  }
}
