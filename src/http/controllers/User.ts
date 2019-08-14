import { Request, Response } from "express";

import { v4 } from "uuid";

import { IFormattedYupError } from "../../utils/ValidateYupError";
import { YupValidate } from "../../validation/YupValidate";
import { UserRegisterSchema } from "../../validation/schemas/UserRegister";

import { Maybe } from "../../types/Maybe";

import { IUser, User } from "../../database/models/User";

import { compare } from "bcryptjs";

import { RedisSessionPrefix, ForgotPasswordPrefix } from "../../Prefixes";

import { SendEmail } from "../../email/SendEmail";
import { ForgotPasswordEmailTemplate } from "../../email/templates/ForgotPassword";

import { InternalServerError } from "../messages/InternalServerError";
import { Unauthorized } from "../messages/Unauthorized";
import { InvalidCredentials } from "../messages/InvalidCredentials";
import { AccountLocked } from "../messages/AccountLocked";
import { EmailSent } from "../messages/EmailSent";

export class UserController {
  public static index = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { page = 0 } = request.query;

      const users = await User.find()
        .skip(parseInt(page) * 20)
        .limit(20);

      return response.json({ page, users });
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
      const { email, page = 0 } = request.query;

      const users: Array<IUser> = await User.find({
        email: {
          $regex: new RegExp(email),
          $options: "i"
        }
      })
        .skip(parseInt(page) * 20)
        .limit(20);

      return response.json({ page, users });
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
      const { email } = request.body;

      const errors: Maybe<Array<IFormattedYupError>> = await YupValidate(
        UserRegisterSchema,
        request.body
      );

      if (errors) {
        return response.status(422).json(errors);
      }

      const userExists = await User.findOne({ email });

      if (userExists) {
        return response
          .status(422)
          .json({ message: "username or email already in use" });
      }

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
    try {
      const { email, password } = request.body;
      const user: Maybe<IUser> = await User.findOne({ email }).select(
        "+password"
      );

      if (!user) {
        return response.status(401).json({ message: InvalidCredentials });
      }

      if (user.accountLocked) {
        return response.status(401).json({ message: AccountLocked });
      }

      const validPassword: boolean = await compare(password, user.password);

      if (!validPassword) {
        return response.status(401).json({ message: InvalidCredentials });
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
      return response.status(401).json({ message: InvalidCredentials });
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

      (request.session as any).destroy();
      return response.send();
    } catch (ex) {
      console.error(ex);
      return response.status(500).json({ message: InternalServerError });
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
        return response.status(401).json({ message: Unauthorized });
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
      return response.status(500).json({ message: InternalServerError });
    }
  };

  public static delete = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { user_id } = request.session as any;

      if (!user_id) {
        return response.status(401).json({ message: Unauthorized });
      }

      await User.findOneAndDelete({ _id: user_id });

      return UserController.logout(request, response);
    } catch (ex) {
      console.error(ex);
      return response.status(500).json({ message: InternalServerError });
    }
  };

  public static forgotPassword = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { email } = request.body;

      const user: Maybe<IUser> = await User.findOne({ email });

      if (!user) {
        return response.status(200).json({ message: EmailSent });
      }

      user.accountLocked = true;

      await user.save();

      const token: string = v4();

      await (request as any).redis.set(
        `${ForgotPasswordPrefix}${token}`,
        user._id,
        "ex",
        60 * 20
      );

      const link: string = `http://${request.headers.host}/reset/${token}`;

      SendEmail(
        email,
        "Good Doggy password reset",
        ForgotPasswordEmailTemplate(link)
      );

      return response.send();
    } catch (ex) {
      console.error(ex);
      return response.status(500).json({ message: InternalServerError });
    }
  };

  public static changePassword = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { token } = request.params;
      const { email, password } = request.body;

      if (!token) {
        return response.status(401).json({ message: "token is required" });
      }

      const userIdThatRequestedToken: boolean = await (request as any).redis.get(
        `${ForgotPasswordPrefix}${token}`
      );

      if (!userIdThatRequestedToken) {
        return response.status(401).json({ message: "link expired" });
      }

      const user: Maybe<IUser> = await User.findOne({ email });

      if (!user) {
        return response.status(401).json({ message: "invalid email" });
      }

      if (user._id.toString() !== userIdThatRequestedToken.toString()) {
        return response.status(200).json({ message: "invalid token" });
      }

      user.password = password;
      user.accountLocked = false;

      await user.save();

      await (request as any).redis.del(`${ForgotPasswordPrefix}${token}`);

      user.password = "";

      return response.status(200).json(user);
    } catch (ex) {
      console.error(ex);
      return response.status(500).json({ message: InternalServerError });
    }
  };
}
