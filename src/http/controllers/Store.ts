import { Response, Request } from "express";
import { Store, IStore } from "../../database/models/Store";

export class StoreController {
  public static index = async (_: any, response: Response): Promise<Response> =>
    response.json(await Store.find());

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
      console.log("sessionID", request.sessionID);
      console.log("store", store);
      return response.status(201).json(store);
    } catch (ex) {
      console.error(ex);
      return response.status(422).json({ message: "failed to register store" });
    }
  };
}
