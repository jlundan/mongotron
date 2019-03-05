import { AbstractError} from "./abstract-error";

/** @class */
export class ConnectionError extends AbstractError {
  constructor(message) {
    super(message);
    this.name = 'Connection Error';
  }
}
