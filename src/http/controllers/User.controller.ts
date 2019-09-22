import { Response } from "express";
import {
  getStatusText,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
  OK,
  BAD_REQUEST
} from "http-status-codes";
import UserService from "../services/User.service";
import RequestWithSession from "../../interfaces/RequestWithSession";

export default class UserController {
  public static index = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { page = 0 } = request.query;

    const { data: users } = await UserService.findAll(page);

    return response.json({ page, users });
  };

  public static getById = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { _id } = request.params;

    const { data: user } = await UserService.findOneBy({
      _id
    });

    return response.json(user);
  };

  public static search = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { email } = request.query;

    const { data: user } = await UserService.findOneByEmail(email);

    return response.json({ user });
  };

  public static register = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { ok, data: user } = await UserService.register(request.body);

    if (!ok) {
      return response
        .status(UNPROCESSABLE_ENTITY)
        .json(getStatusText(UNPROCESSABLE_ENTITY));
    }

    return response.status(201).json(user);
  };

  public static login = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { email, password } = request.body;

    const { ok, data: user } = await UserService.validateCredentials(
      email,
      password
    );
    if (!ok) {
      return response
        .status(UNAUTHORIZED)
        .json({ message: getStatusText(UNAUTHORIZED) });
    }

    await UserService.createSession(user!._id, request);

    return response.status(OK).json(user);
  };

  public static logout = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { ok } = await UserService.logout(request);
    if (!ok) {
      return response
        .status(BAD_REQUEST)
        .json({ message: getStatusText(BAD_REQUEST) });
    }

    return response.send();
  };

  public static update = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { user_id } = request.session;
    const { payload } = request.body;

    const { ok, data: user } = await UserService.updateOne(user_id, payload);
    if (!ok) {
      return response
        .status(BAD_REQUEST)
        .json({ message: getStatusText(BAD_REQUEST) });
    }

    return response.status(OK).json(user);
  };

  public static delete = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { ok } = await UserService.deleteOne(request);
    if (!ok) {
      return response
        .status(BAD_REQUEST)
        .json({ message: getStatusText(BAD_REQUEST) });
    }
    return response.send();
  };

  public static forgotPassword = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { email } = request.body;

    const { ok, data: token } = await UserService.generatePasswordResetToken(
      email
    );
    if (!ok) {
      return response
        .status(BAD_REQUEST)
        .json({ message: getStatusText(BAD_REQUEST) });
    }

    const link: string = `http://${request.headers.host}/reset/${token}`;
    UserService.sendForgotPasswordEmail(email, link);

    return response.send();
  };

  public static changePassword = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { token } = request.params;
    const { email, password } = request.body;

    const { ok, data: user } = await UserService.changePasssowrd(
      token,
      email,
      password
    );
    if (!ok) {
      return response.status(BAD_REQUEST).json({ message: BAD_REQUEST });
    }

    return response.status(OK).json(user);
  };
}
