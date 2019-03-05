import { AbstractError} from "./abstract-error";


/** @class */
export class ObjectNotFoundError extends AbstractError {
  constructor(message) {
    super(message);
    this.name = 'Object Not Found Error';
  }
}
