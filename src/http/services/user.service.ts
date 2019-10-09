import User, { IUser } from "../../database/models/user.model";
import IServiceResult from "../../interfaces/service-result.interface";
import yupValidate from "../../utils/yup-validate";
import { userRegisterSchema } from "../../validation/schemas/user-register.schema";
import { Maybe } from "../../typings/maybe";
import { IFormattedYupError } from "../../utils/format-yup-error";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export default class UserService {
  public static register = async (
    payload: Partial<IUser>
  ): Promise<IServiceResult<{ user: IUser; token: string }>> => {
    const errors: Maybe<IFormattedYupError[]> = await yupValidate(
      userRegisterSchema,
      payload
    );
    if (errors) {
      return { ok: false, message: errors };
    }

    const userExists: Maybe<IUser> = await User.findOne({
      email: payload.email
    });
    if (userExists) {
      return { ok: false, message: "Email already in use" };
    }

    const user: IUser = await User.create(payload);
    const token: string = await UserService.generateJWTToken(user._id);

    user.token = token;
    await user.save();

    user.password = "";
    user.token = "";
    return { ok: true, data: { user, token } };
  };

  public static login = async (
    email: string,
    password: string
  ): Promise<IServiceResult<{ user: IUser; token: string }>> => {
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

    const token: string = await UserService.generateJWTToken(user._id);

    user.token = token;
    await user.save();

    user.password = "";
    user.token = "";
    return { ok: true, data: { user, token } };
  };

  public static logout = async (
    userId: string
  ): Promise<IServiceResult<{}>> => {
    await User.findOneAndUpdate({ _id: userId }, { token: "" });

    return { ok: true };
  };

  public static updateOne = async (
    userId: string,
    payload: IUser
  ): Promise<IServiceResult<IUser>> => {
    const user: Maybe<IUser> = await User.findOneAndUpdate(
      { _id: userId },
      { $set: payload },
      {
        new: true
      }
    );

    if (!user) {
      return { ok: false };
    }

    return { ok: true, data: user };
  };

  public static isTokenValid = async (
    userId: string,
    token: string
  ): Promise<boolean> => {
    const user: Maybe<IUser> = await User.findOne({
      _id: userId
    }).select("+token");

    return user!.token === token;
  };

  private static generateJWTToken = async (userId: string) =>
    await sign({ userId }, process.env.JWT_SECRET!);
}
