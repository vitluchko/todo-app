import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { RedisService } from "src/modules/redis/redis.service";
import { UserService } from "src/modules/user/user.service";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh-token',
) {
    constructor (
        private readonly configService: ConfigService,
        private readonly redisService: RedisService,
        private readonly userService: UserService,
    ) {
        super ({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request?.cookies?.Refresh;
            }]),
            secretOrKey: configService.get<string>('REFRESH_KEY'),
            passReqToCallback: true,
        });
    }

    async validate(request: Request, payload: TokenPayload) {
        const user = await this.userService.getById(payload.userId);
        user.password = undefined;
        const refreshToken = request.cookies?.Refresh;
        
        return this.redisService.getIfRefreshTokenMatches(user, refreshToken);
    }
}
