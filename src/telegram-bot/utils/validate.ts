import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export const validate = function <T extends object>(obj: T, ValidationClass: new () => T) {
  const validatedObj = plainToInstance(ValidationClass, obj, { enableImplicitConversion: true });
  const errors = validateSync(validatedObj, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
};
