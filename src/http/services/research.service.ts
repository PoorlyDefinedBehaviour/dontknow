import Research, { IResearch } from "../../database/models/research.model";
import IServiceResult from "../../interfaces/service-result.interface";
import yupValidate from "../../utils/yup-validate";
import { researchRegisterSchema } from "../../validation/schemas/research-register.schema";
import { Maybe } from "../../typings/maybe";
import { IFormattedYupError } from "../../utils/format-yup-error";

export default class ResearchService {
  public static create = async (
    authorId: string,
    payload: Partial<IResearch>
  ): Promise<IServiceResult<IResearch>> => {
    const errors: Maybe<IFormattedYupError[]> = await yupValidate(
      researchRegisterSchema,
      payload
    );
    if (errors) {
      return { ok: false, message: errors };
    }

    const researchAlreadyCreatedByAuthor = await Research.findOne({
      $and: [{ authors: authorId }, { topic: payload.topic }]
    });
    if (researchAlreadyCreatedByAuthor) {
      return { ok: false, message: "Research already registered by this user" };
    }

    const researchToBeCreated = {
      ...payload,
      authors: [authorId]
    };
    const research: IResearch = await Research.create(researchToBeCreated);

    return { ok: true, data: research };
  };
}
