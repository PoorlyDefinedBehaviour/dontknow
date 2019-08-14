import { Request, Response } from "express";

import { Maybe } from "../../types/Maybe";

import { IFormattedYupError } from "../../utils/ValidateYupError";
import { YupValidate } from "../../validation/YupValidate";
import { ScheduleRegisterSchema } from "../../validation/schemas/ScheduleRegister";

import { ISchedule, Schedule } from "../../database/models/Schedule";
import { Store } from "../../database/models/Store";
import { Client } from "../../database/models/Client";

import { Unauthorized } from "../messages/Unauthorized";
import { InternalServerError } from "../messages/InternalServerError";

export class ScheduleController {
  public static index = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { page = 0 } = request.query;

      const schedules: Array<ISchedule> = await Schedule.find()
        .skip(parseInt(page) * 20)
        .limit(20);

      return response.json({ page, schedules });
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

      const schedule = await Schedule.findOne({
        _id
      });

      if (
        !schedule ||
        (schedule.issuer as any).owner._id.toString() !== user_id.toString()
      ) {
        return response.status(401).json({ message: Unauthorized });
      }

      console.log("schedule", schedule);

      return response.json(schedule);
    } catch (ex) {
      console.error(ex);
      return response.status(500).json({ message: InternalServerError });
    }
  };

  public static search = async (
    request: Request,
    response: Response
  ): Promise<Response> => {
    try {
      const { date, time, page = 0 } = request.query;
      console.log(date, time, page);

      const schedules: Array<ISchedule> = await Schedule.find({
        $or: [
          {
            date: {
              $regex: new RegExp(date),
              $options: "i"
            }
          }
        ]
      })
        .skip(parseInt(page) * 20)
        .limit(20);

      console.log("num schedules", schedules.length);

      return response.json({ page, schedules });
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
        return response
          .status(401)
          .json({ message: "user must be store owner" });
      }

      const schedule: ISchedule = await Schedule.create(request.body);

      return response.status(201).json(schedule);
    } catch (ex) {
      console.error(ex);
      return response.status(500).json({ message: InternalServerError });
    }
  };
}
