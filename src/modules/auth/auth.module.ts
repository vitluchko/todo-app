import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { RedisModule } from "../redis/redis.module";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./strategies/local.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtRefreshTokenStrategy } from "./strategies/refresh-token.strategy";
import { EmailModule } from "../email/email.module";

@Module({
    imports: [
        UserModule,
        PassportModule,
        RedisModule,
        EmailModule,
        JwtModule.register({ }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        JwtRefreshTokenStrategy,
    ],
})
export class AuthModule { }
