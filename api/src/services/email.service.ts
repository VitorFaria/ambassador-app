import { createTransport } from "nodemailer";
import type {
  SendMailOptions,
  SMTPSentMessageInfo,
  SMTPTransportOptions,
  Transporter,
} from "nodemailer";

class EmailService {
  private transporter?: Transporter<SMTPSentMessageInfo, SMTPTransportOptions>;

  private getTransporter(): Transporter<SMTPSentMessageInfo, SMTPTransportOptions> {
    if (this.transporter) return this.transporter;

    const host = process.env.EMAIL_HOST;
    const port = Number(process.env.EMAIL_PORT);

    if (!host || !Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error("EMAIL_HOST and a valid EMAIL_PORT must be configured");
    }

    const user = process.env.EMAIL_USER;
    const password = process.env.EMAIL_PASSWORD;

    this.transporter = createTransport({
      host,
      port,
      secure: port === 465,
      ...(user && password ? { auth: { user, pass: password } } : {}),
    });

    return this.transporter;
  }

  verifyConnection(): Promise<boolean> {
    return this.getTransporter().verify();
  }

  sendEmail(message: SendMailOptions): Promise<SMTPSentMessageInfo> {
    return this.getTransporter().sendMail(message);
  }
}

export const emailService = new EmailService();
