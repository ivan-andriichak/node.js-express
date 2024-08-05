import path from "node:path";

import nodemailer, { Transporter } from "nodemailer";
import hbs from "nodemailer-express-handlebars";

import { configs } from "../configs/configs";
import { emailConstant } from "../constants/email.constant";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { EmailTypeToPayloadType } from "../types/email-type-to-payload.type";

class EmailService {
  private transporter: Transporter;

  constructor() {
    // Створення транспорту для Nodemailer з використанням Gmail
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      from: configs.SMTP_EMAIL,
      auth: {
        user: configs.SMTP_EMAIL,
        pass: configs.SMTP_PASSWORD,
      },
    });

    // Налаштування використання шаблонів Handlebars для листів
    this.transporter.use(
      "compile",
      hbs({
        viewEngine: {
          extname: ".hbs",
          partialsDir: path.join(process.cwd(), "src", "templates", "partials"), // Шлях до часткових шаблонів
          layoutsDir: path.join(process.cwd(), "src", "templates", "layouts"), // Шлях до основних шаблонів
        },
        viewPath: path.join(process.cwd(), "src", "templates", "views"), // Шлях до основного каталогу з шаблонами
        extName: ".hbs",
      }),
    );
  }

  // Метод для відправки листів
  public async sendEmail<T extends EmailTypeEnum>(
    type: T,
    to: string,
    context: EmailTypeToPayloadType[T],
  ): Promise<void> {
    // Отримання теми та шаблону для певного типу листа
    const { subject, template } = emailConstant[type];

    // Додавання URL фронтенду до контексту шаблону
    context["frontUrl"] = configs.FRONTEND_URL;

    // Налаштування опцій для листа
    const options = {
      to,
      subject,
      template,
      context,
    };

    // Відправка листа
    await this.transporter.sendMail(options);
  }
}

// Експортуємо екземпляр EmailService
export const emailService = new EmailService();
