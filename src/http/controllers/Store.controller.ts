import { Response } from "express";
import RequestWithSession from "../../interfaces/RequestWithSession";
import {
  UNPROCESSABLE_ENTITY,
  getStatusText,
  CREATED,
  OK
} from "http-status-codes";
import StoreService from "../services/Store.service";

export default class StoreController {
  public static index = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { page = 0 } = request.query;
    const { user_id } = request.session;

    const { data: stores } = await StoreService.findManyByOwner(user_id, page);

    return response.json({ stores, page });
  };

  public static getById = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { _id } = request.params;

    const store = await StoreService.findOneBy({ _id });

    return response.json(store);
  };

  public static register = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { user_id } = request.session;
    const { name, email, phone } = request.body;

    const { ok, data: store } = await StoreService.register(
      user_id,
      name,
      email,
      phone
    );

    if (!ok) {
      return response
        .status(UNPROCESSABLE_ENTITY)
        .json({ message: getStatusText(UNPROCESSABLE_ENTITY) });
    }

    return response.status(CREATED).json(store);
  };

  public static patch = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { user_id } = request.session;
    const { payload } = request.body;

    const { data: store } = await StoreService.updateOne(user_id, payload);

    return response.status(OK).json(store);
  };

  public static delete = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { user_id } = request.session;
    const { _id } = request.params;

    await StoreService.deleteOne(user_id, _id);

    return response.send();
  };
}
