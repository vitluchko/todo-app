import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import EmailService from "./email.service";
import VerificationTokenPayload from "../interfaces/verification-payload.interface";
import { UserService } from "src/modules/user/user.service";

@Injectable()
export class EmailConfirmationService {
    constructor (
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly emailService: EmailService,
        private readonly userService: UserService,
    ) { }

    public sendVerificationLink(email: string) {
        const payload: VerificationTokenPayload = { email };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('VERIFICATION_KEY'),
            expiresIn: `${this.configService.get<string>('VERIFICATION_EXPIRATION_TIME')}s`,
        });

        const url = `${this.configService.get<string>('EMAIL_CONFIRMATION_URL')}${token}`;

        const text = `Welcome to the perfect todo application. To confirm the email address, click here: ${url}`;

        return this.emailService.sendMail({
            to: email,
            subject: 'Email confirmation',
            text,
        });
    }

    public async confirmEmail(email: string) {
        const user = await this.userService.getByEmail(email);
        if (user.isEmailConfirmed) {
            throw new ConflictException('Email already confirmed');
        }
        await this.userService.markEmailAsConfirmed(email);
    }

    public async decodeConfirmationToken(token: string) {
        try {
            const payload = await this.jwtService.verify(token, {
                secret: this.configService.get<string>('VERIFICATION_KEY'),
            });

            if (typeof payload === 'object' && 'email' in payload) {
                return payload.email;
            }
            throw new BadRequestException();
        } catch (error) {
            console.log(error.name);
            if (error?.name === 'TokenExpiredError') {
                throw new ConflictException('Email confirmation token expired');
            }
            throw new BadRequestException('Bad confirmation token');
        }
    }

    public async resendConfirmationLink(userId: number) {
        const user = await this.userService.getById(userId);
        if (user.isEmailConfirmed) {
            throw new ConflictException('Email already confirmed');
        }
        await this.sendVerificationLink(user.email);
    }
}
