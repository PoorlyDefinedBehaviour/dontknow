import { Response, Request } from "express";
import { Store, IStore } from "../../database/models/Store";
import { InternalServerError } from "../messages/InternalServerError";

export class StoreController {
  public static index = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { user_id } = request.session as any;

      if (!user_id) {
        return response.status(401).json({ message: "user must be logged in" });
      }

      const { page = 0 } = request.query;

      const stores = await Store.find({ owner: user_id })
        .skip(parseInt(page) * 20)
        .limit(20);

      return response.json({ stores, page });
    } catch (ex) {
      console.error(ex);
      return response.status(500).json({ message: InternalServerError });
    }
  };

  public static getById = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { _id } = request.params;

      return response.json(await Store.findOne({ _id }));
    } catch (ex) {
      console.error(ex);
      return response.status(404).json({ message: "failed to find store" });
    }
  };

  public static search = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { page = 0, name, owner_name, email, phone } = request.query;

      const stores: Array<IStore> = await Store.find()
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
    } catch (ex) {
      console.error(ex);
      return response
        .status(500)
        .json({ message: "oops something went wrong" });
    }
  };

  public static register = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { user_id } = request.session as any;

      if (!user_id) {
        return response.status(401).json({ message: "user must be logged in" });
      }

      const storeExists = !!(await Store.findOne({}).or([
        { name: request.body.name },
        { email: request.body.email },
        { phone: request.body.phone }
      ]));

      if (storeExists) {
        return response
          .status(422)
          .json({ message: "store name, email and phone must be unique" });
      }

      const payload = {
        owner: user_id,
        ...request.body
      };

      const store: IStore = await Store.create(payload);

      return response.status(201).json(store);
    } catch (ex) {
      console.error(ex);
      return response.status(422).json({ message: "failed to register store" });
    }
  };

  public static patch = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { user_id } = request.session as any;
      const { payload } = request.body;

      if (!user_id) {
        return response.status(401).json({ message: "user must be logged in" });
      }

      console.log("payload", payload);

      const store = await Store.findOneAndUpdate({ owner: user_id }, payload, {
        new: true
      });

      return response.status(200).json(store);
    } catch (ex) {
      console.error(ex);
      return response
        .status(500)
        .json({ message: "oops something went wrong" });
    }
  };

  public static delete = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { user_id } = request.session as any;
      const { _id } = request.params;

      console.log("user_id", user_id);
      console.log("_id", _id);
      if (!user_id) {
        return response.status(401).json({ message: "user must be logged in" });
      }

      const store = await Store.findOne({ _id });

      console.log("store", store);

      if (!store || (store.owner as any)._id != user_id) {
        return response.status(401).json({ message: "user must own store" });
      }

      /**
       * TODO: Delete clients/schedules
       */

      await Store.findOneAndDelete({ _id });

      return response.send();
    } catch (ex) {
      console.error(ex);
      return response
        .status(500)
        .json({ message: "oops, something went wrong" });
    }
  };
}
