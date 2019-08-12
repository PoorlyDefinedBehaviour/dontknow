import { Request, Response } from "express";

import { IFormattedYupError } from "../../utils/ValidateYurpError";
import { YupValidate } from "../../validation/YupValidate";
import { UserRegisterSchema } from "../../validation/schemas/Register";

import { Maybe } from "../../types/Maybe";

import { IUser, User } from "../../database/models/User";

import { compare } from "bcryptjs";

import { RedisSessionPrefix } from "../../Prefixes";

export class UserController {
  public static index = async (_: any, response: Response): Promise<Response> =>
    response.json(await User.find());

  public static getById = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { _id } = request.params;

      return response.json(await User.findOne({ _id }));
    } catch (ex) {
      console.error(ex);
      return response.status(404).json({ message: "failed to find user" });
    }
  };

  public static search = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { page = 0 } = request.query;
      const { email } = request.params;

      const users: Array<IUser> = await User.find({
        email: {
          $regex: new RegExp(email),
          $options: "i"
        }
      })
        .skip(page * 20)
        .limit(20);

      return response.json(users);
    } catch (ex) {
      console.error(ex);
      return response.status(404).json({ message: "failed to find user" });
    }
  };

  public static register = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const errors: Maybe<Array<IFormattedYupError>> = await YupValidate(
        UserRegisterSchema,
        request.body
      );

      const { email } = request.body;

      const userExists = await User.findOne({ email });
      if (userExists) {
        return response
          .status(422)
          .json({ message: "username or email already in use" });
      }

      if (errors) return response.status(422).json(errors);

      const user: IUser = await User.create(request.body);

      user.password = "";

      return response.status(201).json(user);
    } catch (ex) {
      console.error(ex);
      return response.status(500).json({ message: "failed to register" });
    }
  };

  public static login = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    const InvalidCredentialsMessage: string = "invalid credentials";

    try {
      const { email, password } = request.body;
      const user: Maybe<IUser> = await User.findOne({ email }).select(
        "+password"
      );

      if (!user) {
        return response
          .status(401)
          .json({ message: InvalidCredentialsMessage });
      }

      const validPassword: boolean = await compare(password, user.password);

      if (!validPassword) {
        return response
          .status(401)
          .json({ message: InvalidCredentialsMessage });
      }

      (request as any).session.user_id = user._id;

      if (request.sessionID) {
        await (request as any).redis.lpush(
          `${RedisSessionPrefix}${user._id}`,
          request.sessionID
        );
      }

      user.password = "";

      return response.status(200).json(user);
    } catch (ex) {
      console.error(ex);
      return response.status(401).json({ message: InvalidCredentialsMessage });
    }
  };

  public static logout = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { user_id } = request.session as any;

      if (user_id) {
        await (request as any).redis.del(`${RedisSessionPrefix}${user_id}`);
      }

      return response.send();
    } catch (ex) {
      console.error(ex);
      return response
        .status(500)
        .json({ message: "oops, something went wrong" });
    }
  };

  public static update = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { user_id } = request.session as any;
      const { payload } = request.body;

      if (!user_id) {
        return response.status(401).json({ message: "user must be logged in" });
      }

      const user = await await User.findOneAndUpdate(
        { _id: user_id },
        payload,
        {
          new: true
        }
      );

      return response.status(200).json(user);
    } catch (ex) {
      console.error(ex);
      return response
        .status(500)
        .json({ message: "oops, something went wrong" });
    }
  };

  public static delete = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { user_id } = request.session as any;

      if (!user_id) {
        return response.status(401).json({ message: "user must be logged in" });
      }

      await User.findOneAndDelete({ _id: user_id });

      return UserController.logout(request, response);
    } catch (ex) {
      console.error(ex);
      return response
        .status(500)
        .json({ message: "oops, something went wrong" });
    }
  };
}
