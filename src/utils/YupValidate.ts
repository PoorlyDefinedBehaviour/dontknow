import formatYupError, { IFormattedYupError } from "./FormatYupError";
import { Maybe } from "../types/Maybe";

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
