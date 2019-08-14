import * as yup from "yup";

export const ScheduleRegisterSchema = yup.object().shape({
  issuer: yup.string().required(),
  client: yup.string().required(),
  date: yup.string().required(),
  time: yup.string().required()
});
