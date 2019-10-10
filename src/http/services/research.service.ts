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

  public static findAllByAuthorId = async (
    authorId: string
  ): Promise<IServiceResult<IResearch[]>> => {
    const researches: IResearch[] = await Research.find({
      authors: authorId
    });

    return { ok: true, data: researches };
  };

  public static findById = async (
    researchId: string
  ): Promise<IServiceResult<Maybe<IResearch>>> => {
    const research: Maybe<IResearch> = await Research.findOne({
      _id: researchId
    });

    return { ok: true, data: research };
  };
  public static updateOne = async (
    authorId: string,
    researchId: string,
    payload: Partial<IResearch>
  ): Promise<IServiceResult<Maybe<IResearch>>> => {
    const research: Maybe<IResearch> = await Research.findOneAndUpdate(
      {
        $and: [
          { authors: authorId },
          {
            _id: researchId
          }
        ]
      },
      payload,
      { new: true }
    );

    if (!research) {
      return { ok: false };
    }

    return { ok: true, data: research };
  };

  public static deleteOne = async (
    authorId: string,
    researchId: string
  ): Promise<IServiceResult<IResearch>> => {
    await Research.deleteOne({
      $and: [{ _id: researchId, authors: authorId }]
    });

    return { ok: true };
  };
}
