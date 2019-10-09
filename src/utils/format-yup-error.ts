import { ValidationError } from "yup";

export interface IFormattedYupError {
  path: string;
  message: string;
}

export default (error: ValidationError): Array<IFormattedYupError> =>
  error.inner.map(
    ({ path, message }: ValidationError): IFormattedYupError => ({
      path,
      message
    })
  );
