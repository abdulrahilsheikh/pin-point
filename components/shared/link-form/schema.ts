import * as yup from "yup";

export const LinkFormSchema = yup.object().shape({
  desc: yup.string().required("Description is required"),
  image: yup.string().optional(),
  title: yup.string().required("Title is required"),
  url: yup
    .string()
    .required("URL is required")
    .matches(
      /^https?:\/\/([\w-]+\.)+[\w-]{2,6}(\/\S*)?$/i,
      "Enter a valid URL"
    ),
});
