import { ValidationError } from '../shared/result';

class ValidationException extends Error {
  errors: ValidationError = {};

  constructor(message: string, errors: ValidationError) {
    super(message);
    this.name = ValidationException.name;
    this.errors = errors;
  }
}

export default ValidationException;