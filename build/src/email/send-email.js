"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
exports.default = (to, subject, html) => transporter.sendMail({ from: process.env.EMAIL, to, subject, html }, (ex, _) => {
    if (ex) {
        console.error(`Failed to send email to:${to}\nsubject: ${subject}`);
        console.error(ex);
    }
});
