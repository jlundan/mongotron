import { AbstractError} from "./abstract-error";

/** @class */
export class InvalidArugmentError extends AbstractError {
  constructor(message) {
    super(message);
    this.name = 'Invalid Argument Error';
  }
}
