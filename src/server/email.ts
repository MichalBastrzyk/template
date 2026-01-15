import { render } from "@react-email/components";
import type { ReactElement } from "react";
import type { Transporter } from "nodemailer";
import nodemailer from "nodemailer";

import { env } from "@/env";

export interface SendEmailOptions {
  to: string;
  subject: string;
  reactEmailTemplate: ReactElement;
  text?: string;
  replyTo?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

class EmailClient {
  private transporter: Transporter;

  constructor() {
    this.transporter = this.createTransporter();
  }

  private createTransporter(): Transporter {
    const config = {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      ...(env.SMTP_USER &&
        env.SMTP_PASSWORD && {
          auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASSWORD,
          },
        }),
    };

    if (env.NODE_ENV === "development") {
      console.log("[EmailClient] SMTP Configuration:", {
        host: config.host,
        port: config.port,
        secure: config.secure,
        hasAuth: Boolean(config.auth),
      });
    }

    return nodemailer.createTransport(config);
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      if (env.NODE_ENV === "development") {
        console.log("[EmailClient] SMTP connection verified successfully");
      }
      return true;
    } catch (error) {
      console.error(
        "[EmailClient] SMTP connection verification failed:",
        error,
      );
      return false;
    }
  }

  async sendEmail(options: SendEmailOptions): Promise<EmailSendResult> {
    try {
      const html = await render(options.reactEmailTemplate, {
        pretty: env.NODE_ENV === "development",
      });

      const text =
        options.text ??
        (await render(options.reactEmailTemplate, {
          plainText: true,
        }));

      const mailOptions = {
        from: {
          name: env.SMTP_FROM_NAME,
          address: env.SMTP_FROM_EMAIL,
        },
        to: options.to,
        subject: options.subject,
        html,
        text,
        ...(options.replyTo && { replyTo: options.replyTo }),
      };

      if (env.NODE_ENV === "development") {
        console.log("[EmailClient] Sending email:", {
          to: mailOptions.to,
          subject: mailOptions.subject,
          from: mailOptions.from,
        });
      }

      const info = await this.transporter.sendMail(mailOptions);

      if (env.NODE_ENV === "development") {
        console.log("[EmailClient] Email sent successfully:", {
          messageId: info.messageId,
          response: info.response,
        });
      }

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error("[EmailClient] Failed to send email:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  getConfig() {
    return {
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      from: {
        email: env.SMTP_FROM_EMAIL,
        name: env.SMTP_FROM_NAME,
      },
    };
  }
}

const globalForEmail = globalThis as unknown as {
  emailClient?: EmailClient;
};

if (!globalForEmail.emailClient) {
  globalForEmail.emailClient = new EmailClient();
}

export const emailClient = globalForEmail.emailClient;

export { EmailClient };
