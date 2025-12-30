import { ValidationError } from '../shared/result';

export const runValidators = (
  validations: { field: string; error: string | null }[],
): ValidationError => {
  const errors: ValidationError = {};

  validations.forEach(({ field, error }) => {
    if (error) {
      if (!errors[field]) errors[field] = [];
      errors[field].push(error);
    }
  });

  return errors;
};
