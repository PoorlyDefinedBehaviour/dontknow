import { Response } from "express";
import { Maybe } from "../../types/Maybe";
import { IFormattedYupError } from "../../utils/FormatYupError";
import { ClientRegisterSchema } from "../../validation/schemas/ClientRegister";
import Client, { IClient } from "../../database/models/Client";
import Store, { IStore } from "../../database/models/Store";
import yupValidate from "../../utils/YupValidate";
import RequestWithSession from "../../interfaces/RequestWithSession";
import {
  UNAUTHORIZED,
  getStatusText,
  UNPROCESSABLE_ENTITY,
  CREATED
} from "http-status-codes";

export default class ClientController {
  public static index = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { user_id } = request.session;
    const { store_id, page = 0 } = request.query;

    const store: Maybe<IStore> = await Store.findOne({ _id: store_id });

    if (!store || (store.owner as any)._id != user_id) {
      return response
        .status(UNAUTHORIZED)
        .json({ message: getStatusText(UNAUTHORIZED) });
    }

    const clients: IClient[] = await Client.find({ store: store._id })
      .skip(page * 20)
      .limit(20);

    return response.json({ clients, page });
  };

  public static getById = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { user_id } = request.session;
    const { _id } = request.params;

    const [client]: IClient[] = (await Client.find({ _id })).filter(
      (c: any): boolean => c.store.owner._id == user_id
    );

    return response.json(client);
  };

  public static register = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { user_id } = request.session;

    const errors: Maybe<IFormattedYupError[]> = await yupValidate(
      ClientRegisterSchema,
      request.body
    );

    if (errors) {
      return response.status(UNPROCESSABLE_ENTITY).json(errors);
    }

    const store: Maybe<IStore> = await Store.findOne({
      _id: request.body.store
    });

    if (!store || (store.owner as any)._id != user_id) {
      return response
        .status(UNAUTHORIZED)
        .json({ message: getStatusText(UNAUTHORIZED) });
    }

    const clientExists: Maybe<IClient> = await Client.findOne({
      email: request.body.email
    });

    if (clientExists) {
      return response
        .status(UNPROCESSABLE_ENTITY)
        .json({ message: getStatusText(UNPROCESSABLE_ENTITY) });
    }

    const client: IClient = await Client.create(request.body);

    return response.status(CREATED).json(client);
  };

  public static patch = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { _id } = request.params;
    const { payload } = request.body;

    const client: Maybe<IClient> = await Client.findOneAndUpdate(
      { _id },
      payload,
      {
        new: true
      }
    );

    return response.json(client);
  };

  public static delete = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { _id } = request.params;

    await Client.findOneAndDelete({ _id });

    return response.send();
  };
}
