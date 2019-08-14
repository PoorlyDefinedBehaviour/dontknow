import { Request, Response } from "express";

import { Maybe } from "../../types/Maybe";

import { IFormattedYupError } from "../../utils/ValidateYupError";
import { YupValidate } from "../../validation/YupValidate";
import { ClientRegisterSchema } from "../../validation/schemas/ClientRegister";

import { Client, IClient } from "../../database/models/Client";
import { Store } from "../../database/models/Store";

import { Unauthorized } from "../messages/Unauthorized";
import { InternalServerError } from "../messages/InternalServerError";

export class ClientController {
  public static index = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { user_id } = request.session as any;
      const { store_id, page = 0 } = request.query;

      if (!user_id) {
        return response.status(401).json({ message: Unauthorized });
      }

      const store = await Store.findOne({ _id: store_id });

      if (!store || (store.owner as any)._id != user_id) {
        return response.status(401).json({ message: "user must own store" });
      }

      const clients = await Client.find({ store: store._id })
        .skip(page * 20)
        .limit(20);

      return response.json({ clients, page });
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
      const { user_id } = request.session as any;
      const { _id } = request.params;

      if (!user_id) {
        return response.status(401).json({ message: Unauthorized });
      }

      const [client] = (await Client.find({ _id })).filter(
        (c: any): boolean => c.store.owner._id == user_id
      );

      return response.json(client);
    } catch (ex) {
      console.error(ex);
      return response.status(500).json({ message: InternalServerError });
    }
  };

  public static register = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { user_id } = request.session as any;

      if (!user_id) {
        return response.status(401).json({ message: Unauthorized });
      }

      const errors: Maybe<Array<IFormattedYupError>> = await YupValidate(
        ClientRegisterSchema,
        request.body
      );

      if (errors) {
        return response.status(422).json(errors);
      }

      const store = await Store.findOne({ _id: request.body.store });

      if (!store || (store.owner as any)._id != user_id) {
        return response.status(401).json({ message: "user must own store" });
      }

      const clientExists = await Client.findOne({ email: request.body.email });

      if (clientExists) {
        return response.status(422).json({ message: "email already in use" });
      }

      const client: IClient = await Client.create(request.body);

      return response.status(201).json(client);
    } catch (ex) {
      console.error(ex);
      return response.status(500).json({ message: InternalServerError });
    }
  };

  public static patch = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { user_id } = request.session as any;
      const { _id } = request.params;
      const { payload } = request.body;

      if (!user_id) {
        return response.status(401).json({ message: Unauthorized });
      }

      const client = await Client.findOneAndUpdate({ _id }, payload, {
        new: true
      });

      return response.json(client);
    } catch (ex) {
      console.error(ex);
      return response.status(500).json({ message: InternalServerError });
    }
  };

  public static delete = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { user_id } = request.session as any;
      const { _id } = request.params;

      if (!user_id) {
        return response.status(401).json({ message: Unauthorized });
      }

      await Client.findOneAndDelete({ _id });

      return response.send();
    } catch (ex) {
      console.error(ex);
      return response.status(500).json({ message: InternalServerError });
    }
  };
}
