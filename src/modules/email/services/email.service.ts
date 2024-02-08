import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

@Injectable()
export default class EmailService {
    private nodemailerTransport: Mail;

    constructor (
        private readonly configService: ConfigService,
    ) {
        this.nodemailerTransport = createTransport({
            service: configService.get<string>('EMAIL_SERVICE'),
            auth: {
                user: configService.get<string>('EMAIL_USER'),
                pass: configService.get<string>('EMAIL_PASSWORD'),
            }
        });
    }

    sendMail(options: Mail.Options) {
        return this.nodemailerTransport.sendMail(options);
    }
}
