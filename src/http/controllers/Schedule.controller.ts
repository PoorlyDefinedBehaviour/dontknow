import { Response } from "express";
import RequestWithSession from "../../interfaces/RequestWithSession";
import {
  UNAUTHORIZED,
  getStatusText,
  UNPROCESSABLE_ENTITY,
  CREATED
} from "http-status-codes";
import ScheduleService from "../services/Schedule.service";

export default class ScheduleController {
  public static index = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { page = 0 } = request.query;

    const { data: schedules } = await ScheduleService.findAll(page);

    return response.json({ page, schedules });
  };

  public static getById = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { user_id } = request.session;
    const { _id } = request.params;

    const { ok, data: schedule } = await ScheduleService.findOneBy(user_id, {
      _id
    });
    if (!ok) {
      return response
        .status(UNAUTHORIZED)
        .json({ message: getStatusText(UNAUTHORIZED) });
    }

    return response.json(schedule);
  };

  public static search = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { date, time, page = 0 } = request.query;

    const { data: schedules } = await ScheduleService.findManyBytext(
      date,
      time,
      page
    );

    return response.json({ page, schedules });
  };

  public static register = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { user_id } = request.session;
    const { client } = request.body;

    const { ok, data: schedule } = await ScheduleService.register(
      user_id,
      client,
      request.body
    );
    if (!ok) {
      return response
        .status(UNPROCESSABLE_ENTITY)
        .json({ message: getStatusText(UNPROCESSABLE_ENTITY) });
    }

    return response.status(CREATED).json(schedule);
  };
}
