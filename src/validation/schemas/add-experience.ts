import * as yup from "yup";

const addExperienceSchema = yup.object().shape({
  title: yup
    .string()
    .min(5, "title must be at least 5 characters long")
    .max(255, "title can't be longer than 255 characters")
    .required(),
  from: yup.date().required(),
  to: yup.date()
});

export default addExperienceSchema;
