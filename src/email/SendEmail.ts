import nodemailer, { SentMessageInfo } from "nodemailer";
import { Maybe } from "../types/Maybe";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASSWORD as string
  }
});

export default (to: string, subject: string, html: string): void =>
  transporter.sendMail(
    { from: process.env.EMAIL as string, to, subject, html },
    (ex: Maybe<Error>, _: SentMessageInfo): void => {
      if (ex) {
        console.error(`Failed to send email to:${to}\nsubject: ${subject}`);
        console.error(ex);
      }
    }
  );
