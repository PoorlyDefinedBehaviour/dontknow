import { Response } from "express";
import RequestWithSession from "../../interfaces/RequestWithSession";
import {
  UNAUTHORIZED,
  getStatusText,
  UNPROCESSABLE_ENTITY,
  CREATED
} from "http-status-codes";
import ClientService from "../services/Client.service";

export default class ClientController {
  public static index = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { user_id } = request.session;
    const { storeId, page = 0 } = request.query;

    const { ok, data: clients } = await ClientService.findAll(
      user_id,
      storeId,
      page
    );
    if (!ok) {
      return response
        .status(UNAUTHORIZED)
        .json({ message: getStatusText(UNAUTHORIZED) });
    }

    return response.json({ clients, page });
  };

  public static getById = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { user_id } = request.session;
    if (!user_id) {
      return response
        .status(UNAUTHORIZED)
        .json({ message: getStatusText(UNAUTHORIZED) });
    }

    const { _id } = request.params;
    const { data: client } = await ClientService.findOneBy({ _id });

    return response.json(client);
  };

  public static register = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { user_id } = request.session;

    const { ok, data: client } = await ClientService.register(
      user_id,
      request.body
    );
    if (!ok) {
      return response
        .status(UNPROCESSABLE_ENTITY)
        .json({ message: getStatusText(UNPROCESSABLE_ENTITY) });
    }

    return response.status(CREATED).json(client);
  };

  public static patch = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { _id } = request.params;
    const { payload } = request.body;

    const { data: client } = await ClientService.updateOne(_id, payload);

    return response.json(client);
  };

  public static delete = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { _id } = request.params;

    await ClientService.deleteOne(_id);

    return response.send();
  };
}
