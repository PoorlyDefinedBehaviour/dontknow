import formatYupError, { IFormattedYupError } from "./format-yup-error";
import { Maybe } from "../typings/maybe";

export default async (
  schema: any,
  object: any
): Promise<Maybe<IFormattedYupError[]>> => {
  try {
    await schema.validate(object, { abortEarly: false });
    return null;
  } catch (ex) {
    return formatYupError(ex);
  }
};
