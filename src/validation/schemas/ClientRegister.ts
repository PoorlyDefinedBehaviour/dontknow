import * as yup from "yup";

export const ClientRegisterSchema = yup.object().shape({
  store: yup.string().required(),
  name: yup.string().required(),
  email: yup
    .string()
    .email()
    .required(),
  phone: yup.string().required()
});
