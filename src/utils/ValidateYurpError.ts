import { ValidationError } from "yup";

export interface IFormattedYupError {
  path: string;
  message: string;
}

export const FormatYupError = (
  error: ValidationError
): Array<IFormattedYupError> =>
  error.inner.map<any>(
    (e: any): IFormattedYupError => ({
      path: e.path,
      message: e.message
    })
  );
