import { Request, Response } from "express";
import ResearchService from "../services/research.service";
import { UNPROCESSABLE_ENTITY, CREATED } from "http-status-codes";

export default class ResearchController {
  public static create = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const userId = request.body.tokenPayload;

    const { ok, data, message } = await ResearchService.create(
      userId,
      request.body.payload
    );
    if (!ok) {
      return response.status(UNPROCESSABLE_ENTITY).json({ message });
    }

    return response.status(CREATED).json({ data });
  };
}
