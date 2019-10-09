import * as yup from "yup";

export const researchRegisterSchema = yup.object().shape({
  topic: yup
    .string()
    .min(5, "Topic must be at least 5 characters long")
    .max(255, "Topic can't be longer than 255 characters")
    .required(),
  summary: yup
    .string()
    .min(10, "Password must be at least 10 characters long")
    .max(500, "Password can't be longer than 500 characters")
    .required()
});
