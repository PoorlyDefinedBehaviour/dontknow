import { Response } from "express";
import { Maybe } from "../../types/Maybe";
import { IFormattedYupError } from "../../utils/FormatYupError";
import yupValidate from "../../utils/YupValidate";
import { ScheduleRegisterSchema } from "../../validation/schemas/ScheduleRegister";
import Schedule, { ISchedule } from "../../database/models/Schedule";
import Store from "../../database/models/Store";
import Client from "../../database/models/Client";
import { Unauthorized } from "../messages/Unauthorized";
import RequestWithSession from "../../interfaces/RequestWithSession";

export default class ScheduleController {
  public static index = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { page = 0 } = request.query;

    const schedules: ISchedule[] = await Schedule.find()
      .skip(parseInt(page) * 20)
      .limit(20);

    return response.json({ page, schedules });
  };

  public static getById = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { user_id } = request.session;
    const { _id } = request.params;

    if (!user_id) {
      return response.status(401).json({ message: Unauthorized });
    }

    const schedule: Maybe<ISchedule> = await Schedule.findOne({
      _id
    });

    if (
      !schedule ||
      (schedule.issuer as any).owner._id.toString() !== user_id.toString()
    ) {
      return response.status(401).json({ message: Unauthorized });
    }

    return response.json(schedule);
  };

  public static search = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { date, time, page = 0 } = request.query;

    const schedules: ISchedule[] = await Schedule.find({
      $or: [
        {
          date: {
            $regex: new RegExp(date),
            $options: "i"
          }
        },
        {
          time: {
            $regex: new RegExp(time),
            $options: "i"
          }
        }
      ]
    })
      .skip(parseInt(page) * 20)
      .limit(20);

    return response.json({ page, schedules });
  };

  public static register = async (
    request: RequestWithSession,
    response: Response
  ): Promise<Response> => {
    const { user_id } = request.session;

    if (!user_id) {
      return response.status(401).json({ message: Unauthorized });
    }

    const errors: Maybe<IFormattedYupError[]> = await yupValidate(
      ScheduleRegisterSchema,
      request.body
    );

    if (errors) {
      return response.status(422).json(errors);
    }

    const store = await Store.findOne({ owner: user_id }).lean();
    const client = await Client.findOne({ _id: request.body.client }).lean();

    if (
      !store ||
      !client ||
      client.store._id.toString() !== store._id.toString()
    ) {
      return response.status(401).json({ message: "user must be store owner" });
    }

    const schedule: ISchedule = await Schedule.create(request.body);

    return response.status(201).json(schedule);
  };
}
