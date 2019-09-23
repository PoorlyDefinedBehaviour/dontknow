import IServiceResult from "../../interfaces/ServiceResult";
import Schedule, { ISchedule } from "../../database/models/Schedule";
import { Maybe } from "../../types/Maybe";
import yupValidate from "../../utils/YupValidate";
import { IFormattedYupError } from "../../utils/FormatYupError";
import { ScheduleRegisterSchema } from "../../validation/schemas/ScheduleRegister";
import StoreService from "./Store.service";
import ClientService from "./Client.service";

export default class ScheduleService {
  public static findAll = async (
    page: number
  ): Promise<IServiceResult<ISchedule[]>> => {
    const schedules: ISchedule[] = await Schedule.find()
      .skip(page * 20)
      .limit(20);

    return { ok: true, data: schedules };
  };

  public static findOneBy = async <T>(
    ownerId: string,
    query: T
  ): Promise<IServiceResult<ISchedule>> => {
    const schedule: Maybe<ISchedule> = await Schedule.findOne(query);

    if (
      !schedule ||
      (schedule.issuer as any).owner._id.toString() !== ownerId
    ) {
      return { ok: false };
    }

    return { ok: true, data: schedule };
  };

  public static findManyBytext = async (
    date: string,
    time: string,
    page: number
  ): Promise<IServiceResult<ISchedule[]>> => {
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
      .skip(page * 20)
      .limit(20);

    return { ok: true, data: schedules };
  };

  public static register = async (
    ownerId: string,
    clientId: string,
    payload: ISchedule
  ): Promise<IServiceResult<ISchedule>> => {
    const errors: Maybe<IFormattedYupError[]> = await yupValidate(
      ScheduleRegisterSchema,
      payload
    );
    if (errors) {
      return { ok: false };
    }

    const { data: store } = await StoreService.findOneBy({ owner: ownerId });
    const { data: client } = await ClientService.findOneBy({ _id: clientId });

    if (
      !store ||
      !client ||
      (client.store as any)._id.toString() !== store._id.toString()
    ) {
      return { ok: false };
    }

    const schedule: ISchedule = await Schedule.create(payload);

    return { ok: true, data: schedule };
  };
}
