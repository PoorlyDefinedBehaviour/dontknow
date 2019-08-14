import * as yup from "yup";

export const UserRegisterSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(255, "Password can't be longer than 255 characters")
    .required()
});
