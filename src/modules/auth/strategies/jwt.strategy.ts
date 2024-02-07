import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/modules/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor (
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) {
        super ({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request?.cookies?.Authentication;
            }]),
            secretOrKey: configService.get<string>('ACCESS_KEY'),
        });
    }

    async validate(payload: TokenPayload) {
        return this.userService.getById(payload.userId);
    }
}
