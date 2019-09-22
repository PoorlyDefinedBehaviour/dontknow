import IServiceResult from "../../interfaces/ServiceResult";
import Client, { IClient } from "../../database/models/Client";
import { Maybe } from "../../types/Maybe";
import StoreService from "./Store.service";
import yupValidate from "../../utils/YupValidate";
import { IFormattedYupError } from "../../utils/FormatYupError";
import { ClientRegisterSchema } from "../../validation/schemas/ClientRegister";

export default class ClientService {
  public static findAll = async (
    ownerId: string,
    storeId: string,
    page: number
  ): Promise<IServiceResult<IClient[]>> => {
    const { data: store } = await StoreService.findOneBy({ _id: storeId });

    if (!store || (store.owner as any)._id != ownerId) {
      return { ok: false };
    }

    const clients: IClient[] = await Client.find({ store: store._id })
      .skip(page * 20)
      .limit(20);

    return { ok: true, data: clients };
  };

  public static findOneBy = async <T>(
    query: T
  ): Promise<IServiceResult<Maybe<IClient>>> => {
    const client: Maybe<IClient> = await Client.findOne(query);

    return { ok: true, data: client };
  };

  public static register = async (
    ownerId: string,
    payload: IClient
  ): Promise<IServiceResult<IClient>> => {
    const errors: Maybe<IFormattedYupError[]> = await yupValidate(
      ClientRegisterSchema,
      payload
    );
    if (errors) {
      return { ok: false };
    }

    const { data: store } = await StoreService.findOneBy({
      _id: payload.store
    });

    if (!store || (store.owner as any)._id != ownerId) {
      return { ok: false };
    }

    const clientExists: Maybe<IClient> = await Client.findOne({
      email: payload.email
    });

    if (clientExists) {
      return { ok: false };
    }

    const client: IClient = await Client.create(payload);

    return { ok: true, data: client };
  };

  public static updateOne = async (
    clientId: string,
    payload: IClient
  ): Promise<IServiceResult<Maybe<IClient>>> => {
    const client: Maybe<IClient> = await Client.findOneAndUpdate(
      { _id: clientId },
      payload,
      {
        new: true
      }
    );

    return { ok: true, data: client };
  };

  public static deleteOne = async (
    clientId: string
  ): Promise<IServiceResult<IClient>> => {
    await Client.findOneAndDelete({ _id: clientId });

    return { ok: true };
  };
}
