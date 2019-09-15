import { Response } from "express";
import Store, { IStore } from "../../database/models/Store";
import RequestWithSession from "../../interfaces/RequestWithSession";
import { Maybe } from "../../types/Maybe";

export default class StoreController {
  public static index = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { page = 0 } = request.query;
    const { user_id } = request.session;

    const stores: IStore[] = await Store.find({ owner: user_id })
      .skip(parseInt(page) * 20)
      .limit(20);

    return response.json({ stores, page });
  };

  public static getById = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { _id } = request.params;

    const store: Maybe<IStore> = await Store.findOne({ _id });

    return response.json(store);
  };

  public static search = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { page = 0, name, owner_name, email, phone } = request.query;

    const stores: IStore[] = await Store.find()
      .or([
        {
          name: {
            $regex: new RegExp(name),
            $options: "i"
          }
        },
        {
          owner_name: {
            $regex: new RegExp(owner_name),
            $options: "i"
          }
        },
        {
          email: {
            $regex: new RegExp(email),
            $options: "i"
          }
        },
        {
          phone: {
            $regex: new RegExp(phone),
            $options: "i"
          }
        }
      ])
      .skip(parseInt(page) * 20)
      .limit(20);

    return response.json({ stores, page });
  };

  public static register = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { user_id } = request.session;

    const storeExists: Maybe<IStore> = await Store.findOne({}).or([
      { name: request.body.name },
      { email: request.body.email },
      { phone: request.body.phone }
    ]);

    if (storeExists) {
      return response
        .status(422)
        .json({ message: "store name, email and phone must be unique" });
    }

    const payload = {
      ...request.body,
      owner: user_id
    };

    const store: IStore = await Store.create(payload);

    return response.status(201).json(store);
  };

  public static patch = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { user_id } = request.session;
    const { payload } = request.body;

    const store: Maybe<IStore> = await Store.findOneAndUpdate(
      { owner: user_id },
      payload,
      {
        new: true
      }
    );

    return response.status(200).json(store);
  };

  public static delete = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { user_id } = request.session;
    const { _id } = request.params;

    const store: Maybe<IStore> = await Store.findOne({ _id });

    if (!store || (store.owner as any)._id != user_id) {
      return response.status(401).json({ message: "user must own store" });
    }

    /**
     * TODO: Delete clients/schedules
     */

    await Store.findOneAndDelete({ _id });

    return response.send();
  };
}
