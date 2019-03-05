import { AbstractError} from "./abstract-error";

/** @class */
export class InternalServiceError extends AbstractError {
  constructor(message) {
    super(message);
    this.name = 'Internal Service Error';
  }
}
