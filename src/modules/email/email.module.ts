import { Module } from "@nestjs/common";
import EmailService from "./services/email.service";
import { JwtModule } from "@nestjs/jwt";
import { EmailConfirmationService } from "./services/email-confirm.service";
import { EmailConfirmationController } from "./email-confirm.controller";
import { UserModule } from "../user/user.module";
import { JwtStrategy } from "../auth/strategies/jwt.strategy";

@Module({
    imports: [
        UserModule,
        JwtModule.register({}),
    ],
    controllers: [EmailConfirmationController],
    providers: [
        EmailService,
        EmailConfirmationService,
        JwtStrategy,
    ],
    exports: [
        EmailService,
        EmailConfirmationService
    ],
})
export class EmailModule { }
