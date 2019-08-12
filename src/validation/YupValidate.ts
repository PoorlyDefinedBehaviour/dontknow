import { IFormattedYupError, FormatYupError } from "../utils/ValidateYupError";
import { Maybe } from "../types/Maybe";

export const YupValidate = async (
  schema: any,
  object: any
): Promise<Maybe<Array<IFormattedYupError>>> => {
  try {
    await schema.validate(object, { abortEarly: false });
    return null;
  } catch (ex) {
    return FormatYupError(ex);
  }
};
