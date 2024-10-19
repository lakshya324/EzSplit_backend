import { createTransport } from "nodemailer";
import { transporter } from "../config/env";

export default createTransport({
    service: transporter.service,
    auth: {
      user: transporter.auth.user,
      pass: transporter.auth.pass,
    },
  });