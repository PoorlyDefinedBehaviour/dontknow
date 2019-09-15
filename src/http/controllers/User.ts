import { Response } from "express";
import { v4 } from "uuid";
import { IFormattedYupError } from "../../utils/FormatYupError";
import yupValidate from "../../utils/YupValidate";
import { UserRegisterSchema } from "../../validation/schemas/UserRegister";
import { Maybe } from "../../types/Maybe";
import User, { IUser } from "../../database/models/User";
import { compare } from "bcryptjs";
import { RedisSessionPrefix, ForgotPasswordPrefix } from "../../Prefixes";
import { SendEmail } from "../../email/SendEmail";
import { ForgotPasswordEmailTemplate } from "../../email/templates/ForgotPassword";
import { InvalidCredentials } from "../messages/InvalidCredentials";
import { AccountLocked } from "../messages/AccountLocked";
import { EmailSent } from "../messages/EmailSent";
import RequestWithSession from "../../interfaces/RequestWithSession";
import redis from "../../Redis";

export default class UserController {
  public static index = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { page = 0 } = request.query;

    const users: IUser[] = await User.find()
      .skip(parseInt(page) * 20)
      .limit(20);

    return response.json({ page, users });
  };

  public static getById = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { _id } = request.params;

    const user: Maybe<IUser> = await User.findOne({ _id });

    return response.json(user);
  };

  public static search = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { email, page = 0 } = request.query;

    const users: IUser[] = await User.find({
      email: {
        $regex: new RegExp(email),
        $options: "i"
      }
    })
      .skip(parseInt(page) * 20)
      .limit(20);

    return response.json({ page, users });
  };

  public static register = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { email } = request.body;

    const errors: Maybe<IFormattedYupError[]> = await yupValidate(
      UserRegisterSchema,
      request.body
    );

    if (errors) {
      return response.status(422).json(errors);
    }

    const userExists: Maybe<IUser> = await User.findOne({ email });

    if (userExists) {
      return response
        .status(422)
        .json({ message: "username or email already in use" });
    }

    const user: IUser = await User.create(request.body);

    user.password = "";

    return response.status(201).json(user);
  };

  public static login = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
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

    request.session.user_id = user._id;

    if (request.sessionID) {
      await redis.lpush(`${RedisSessionPrefix}${user._id}`, request.sessionID);
    }

    user.password = "";

    return response.status(200).json(user);
  };

  public static logout = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { user_id } = request.session;

    if (user_id) {
      await redis.del(`${RedisSessionPrefix}${user_id}`);
    }

    request.session.destroy();
    return response.send();
  };

  public static update = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { user_id } = request.session;
    const { payload } = request.body;

    const user = await await User.findOneAndUpdate({ _id: user_id }, payload, {
      new: true
    });

    return response.status(200).json(user);
  };

  public static delete = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { user_id } = request.session;

    await User.findOneAndDelete({ _id: user_id });

    return UserController.logout(request, response);
  };

  public static forgotPassword = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { email } = request.body;

    const user: Maybe<IUser> = await User.findOne({ email });

    if (!user) {
      return response.status(200).json({ message: EmailSent });
    }

    user.accountLocked = true;

    await user.save();

    const token: string = v4();

    await redis.set(`${ForgotPasswordPrefix}${token}`, user._id, "ex", 60 * 20);

    const link: string = `http://${request.headers.host}/reset/${token}`;

    SendEmail(
      email,
      "Good Doggy password reset",
      ForgotPasswordEmailTemplate(link)
    );

    return response.send();
  };

  public static changePassword = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { token } = request.params;
    const { email, password } = request.body;

    if (!token) {
      return response.status(401).json({ message: "token is required" });
    }

    const userIdThatRequestedToken: Maybe<string> = await redis.get(
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

    await redis.del(`${ForgotPasswordPrefix}${token}`);

    user.password = "";

    return response.status(200).json(user);
  };
}
