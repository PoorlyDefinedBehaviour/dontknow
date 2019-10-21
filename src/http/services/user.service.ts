import User, { IUser, IExperience } from "../../database/models/user.model";
import IServiceResult from "../../interfaces/service-result.interface";
import yupValidate from "../../utils/yup-validate";
import { Maybe } from "../../typings/maybe";
import { IFormattedYupError } from "../../utils/format-yup-error";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { unlink } from "fs";
import userRegisterSchema from "../../validation/schemas/user-register.schema";
import addExperienceSchema from "../../validation/schemas/add-experience";
import { v4 } from "uuid";

export default class UserService {
  public static findUserById = async (
    userId: string
  ): Promise<IServiceResult<Maybe<IUser>>> => {
    const user: Maybe<IUser> = await User.findOne({ _id: userId });

    return { ok: true, data: user };
  };

  public static setUserAvatar = async (
    userId: string,
    file: Express.Multer.File
  ): Promise<IServiceResult<string>> => {
    const user: Maybe<IUser> = await User.findOne({ _id: userId });

    user!.avatar = file.filename;
    await user!.save();

    return { ok: true, data: file.filename };
  };

  public static removeUserAvatar = async (
    userId: string
  ): Promise<IServiceResult<IUser>> => {
    const user: Maybe<IUser> = await User.findOne({ _id: userId });

    const defaultProfileImage: string = "default-profile-picture.png";
    if (user!.avatar == defaultProfileImage) {
      return { ok: true, data: user! };
    }

    unlink(`${process.cwd()}/public/${user!.avatar}`, () => {});

    user!.avatar = defaultProfileImage;
    await user!.save();

    return { ok: true, data: user! };
  };

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

  public static addResearch = async (
    userId: string,
    researchId: string
  ): Promise<void> => {
    const user = await User.findOne({ _id: userId });
    if (user) {
      user.researches.push(researchId as any);
      await user.save();
    }
  };

  public static addExperience = async (
    userId: string,
    payload: IExperience
  ): Promise<IServiceResult<{ id: string }>> => {
    const errors: Maybe<IFormattedYupError[]> = await yupValidate(
      addExperienceSchema,
      payload
    );
    if (errors) {
      return { ok: false, message: errors };
    }

    const user = await User.findOne({ _id: userId });
    const id = v4();
    if (user) {
      user.experiences.push({ ...payload, id });
      await user.save();
    }

    return { ok: true, data: { id } };
  };

  public static removeExperience = async (
    userId: string,
    experienceId: string
  ): Promise<IServiceResult<{}>> => {
    const user = await User.findOne({
      _id: userId
    });

    if (user) {
      user.experiences = user.experiences.filter(
        (exp) => exp.id === experienceId
      );
      await user.save();
    }

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
