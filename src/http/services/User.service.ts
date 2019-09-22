import IServiceResult from "../../interfaces/ServiceResult";
import User, { IUser } from "../../database/models/User";
import { Maybe } from "../../types/Maybe";
import yupValidate from "../../utils/YupValidate";
import { UserRegisterSchema } from "../../validation/schemas/UserRegister";
import { IFormattedYupError } from "../../utils/FormatYupError";
import { compare } from "bcryptjs";
import RequestWithSession from "../../interfaces/RequestWithSession";
import { RedisSessionPrefix, ForgotPasswordPrefix } from "../../Prefixes";
import redis from "../../Redis";
import { v4 } from "uuid";
import sendEmail from "../../email/SendEmail";
import forgotPasswordEmailTemplate from "../../email/templates/ForgotPassword";

export default class UserService {
  public static findAll = async (
    page: number
  ): Promise<IServiceResult<IUser[]>> => {
    const users: IUser[] = await User.find()
      .skip(page * 20)
      .limit(20);

    return { ok: true, data: users };
  };

  public static findOneBy = async <T>(
    query: T
  ): Promise<IServiceResult<Maybe<IUser>>> => {
    const user: Maybe<IUser> = await User.findOne(query);

    return { ok: true, data: user };
  };

  public static findOneByEmail = async (
    email: string
  ): Promise<IServiceResult<Maybe<IUser>>> => {
    const user: Maybe<IUser> = await await User.findOne({
      email: {
        $regex: new RegExp(email),
        $options: "i"
      }
    });

    return { ok: true, data: user };
  };

  public static register = async (
    payload: IUser
  ): Promise<IServiceResult<IUser>> => {
    const errors: Maybe<IFormattedYupError[]> = await yupValidate(
      UserRegisterSchema,
      payload
    );
    if (errors) {
      return { ok: false };
    }
    const userExists: Maybe<IUser> = await User.findOne({
      email: payload.email
    });
    if (userExists) {
      return { ok: false };
    }

    const user: IUser = await User.create(payload);
    user.password = "";
    return { ok: true, data: user };
  };

  public static validateCredentials = async (
    email: string,
    password: string
  ): Promise<IServiceResult<IUser>> => {
    const user: Maybe<IUser> = await User.findOne({
      email: email
    }).select("+password");

    if (!user) {
      return { ok: false };
    }

    const validPassword: boolean = await compare(password, user.password);
    if (!validPassword) {
      return { ok: false };
    }

    return { ok: true, data: user };
  };

  public static createSession = async (
    userId: string,
    request: RequestWithSession
  ): Promise<IServiceResult<IUser>> => {
    request.session.user_id = userId;

    if (request.sessionID) {
      await redis.lpush(`${RedisSessionPrefix}${userId}`, request.sessionID);
    }

    return { ok: true };
  };

  public static logout = async (
    request: RequestWithSession
  ): Promise<IServiceResult<{}>> => {
    const { user_id } = request.session;
    if (!user_id) {
      return { ok: false };
    }

    await redis.del(`${RedisSessionPrefix}${user_id}`);

    request.session.destroy();

    return { ok: true };
  };

  public static updateOne = async (
    userId: string,
    payload: IUser
  ): Promise<IServiceResult<IUser>> => {
    const errors: Maybe<IFormattedYupError[]> = await yupValidate(
      UserRegisterSchema,
      payload
    );
    if (errors) {
      return { ok: false };
    }

    const user = await await User.findOneAndUpdate({ _id: userId }, payload, {
      new: true
    });
    if (!user) {
      return { ok: false };
    }

    return { ok: true, data: user };
  };

  public static deleteOne = async (
    request: RequestWithSession
  ): Promise<IServiceResult<IUser>> => {
    const { user_id } = request.session;
    if (!user_id) {
      return { ok: false };
    }
    await User.findOneAndDelete({ _id: user_id });
    return { ok: true };
  };

  public static generatePasswordResetToken = async (
    email: string
  ): Promise<IServiceResult<string>> => {
    const user: Maybe<IUser> = await User.findOne({ email });
    if (!user) {
      return { ok: false };
    }

    const token: string = v4();
    await redis.set(`${ForgotPasswordPrefix}${token}`, user._id, "ex", 60 * 20);

    return { ok: true, data: token };
  };

  public static sendForgotPasswordEmail = async (
    email: string,
    link: string
  ): Promise<IServiceResult<{}>> => {
    sendEmail(
      email,
      "Good Doggy password reset",
      forgotPasswordEmailTemplate(link)
    );

    return { ok: true };
  };

  public static changePasssowrd = async (
    token: string,
    email: string,
    password: string
  ): Promise<IServiceResult<IUser>> => {
    if (!token || !email || !password) {
      return { ok: false };
    }

    const userIdThatRequestedToken: Maybe<string> = await redis.get(
      `${ForgotPasswordPrefix}${token}`
    );

    const user: Maybe<IUser> = await User.findOne({ email });
    if (!user || user._id.toString() !== userIdThatRequestedToken!.toString()) {
      return { ok: false };
    }
    
    user.password = password;
    await user.save();
    await redis.del(`${ForgotPasswordPrefix}${token}`);

    user.password = "";
    return { ok: true, data: user };
  };
}
