import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService implements OnModuleInit {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) { }

  onModuleInit() {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'sandbox.smtp.mailtrap.io'),
      port: this.configService.get<number>('SMTP_PORT', 2525),
      auth: {
        user: this.configService.get<string>('SMTP_USER', ''),
        pass: this.configService.get<string>('SMTP_PASS', ''),
      },
    });
  }

  async sendMail(params: {
    to: string;
    subject: string;
    templateName: string;
    context: Record<string, any>;
  }): Promise<void> {

    const templatePath = path.join(
      __dirname,
      '..',
      '..',
      'templates',
      `${params.templateName}.hbs`
    );

    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(templateSource);
    const html = compiledTemplate(params.context);

    await this.transporter.sendMail({
      from: this.configService.get<string>('SMTP_FROM', '"BookMyVenue" <noreply@bookmyvenue.com>'),
      to: params.to,
      subject: params.subject,
      html,
    });
  }
}
