import { Request, Response } from "express";
import ResearchService from "../services/research.service";
import {
  UNPROCESSABLE_ENTITY,
  CREATED,
  NO_CONTENT,
  OK,
  NOT_FOUND,
  getStatusText
} from "http-status-codes";

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

  public static findAllByAuthorId = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    console.log("request.params", request.params);
    const { authroId } = request.params;

    const { data } = await ResearchService.findAllByAuthorId(authroId);

    return response.status(OK).json({ data });
  };

  public static findById = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const { _id } = request.params;

    const { data } = await ResearchService.findById(_id);

    return response.status(OK).json({ data });
  };

  public static findOne = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const userId = request.body.tokenPayload;
    const { _id } = request.params;

    await ResearchService.deleteOne(userId, _id);

    return response.status(NO_CONTENT).json();
  };

  public static update = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const userId = request.body.tokenPayload;
    const { _id } = request.params;
    const { payload } = request.body;

    const { ok, data } = await ResearchService.updateOne(userId, _id, payload);
    if (!ok) {
      return response
        .status(NOT_FOUND)
        .json({ message: getStatusText(NOT_FOUND) });
    }

    return response.status(OK).json(data);
  };

  public static delete = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const userId = request.body.tokenPayload;
    const { _id } = request.params;

    await ResearchService.deleteOne(userId, _id);

    return response.status(NO_CONTENT).json();
  };
}
