import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASSWORD as string
  }
});

export const SendEmail = (to: string, subject: string, html: string): void =>
  transporter.sendMail(
    { from: "gooddoggy-services@goodgoddy-services.com", to, subject, html },
    (ex: any, info: any): void => {
      if (ex) {
        console.error(`Failed to send email to:${to}\nsubject: ${subject}`);
        console.error(ex);
      }
      console.log(info);
    }
  );
