import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { RegisterDto } from "./dtos/register.dto";
import RequestWithUser from "./interfaces/user-request.interface";
import { Response } from "express";
import JwtAuthenticationGuard from "./guards/jwt-auth.guard";
import { RedisService } from "../redis/redis.service";
import JwtRefreshGuard from "./guards/refresh-auth.guard";
import { EmailConfirmationService } from "../email/services/email-confirm.service";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { LoginDto } from "./dtos/login.dto";

@Controller('auth')
@ApiTags('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly redisService: RedisService,
        private readonly emailConfirmationService: EmailConfirmationService,
    ) { }

    @Post('register')
    @ApiBody({ type: RegisterDto })
    async register(@Body() registrationData: RegisterDto) {
        const user = this.authService.register(registrationData);
        await this.emailConfirmationService.sendVerificationLink(registrationData.email);
        return user;
    }

    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiBody({ type: LoginDto })
    async login(
        @Req() request: RequestWithUser,
        @Res() response: Response,
    ) {
        const { user } = request;
        const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(user.id);
        const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(user.id);
        
        await this.redisService.insertToken(user.id, refreshTokenCookie.token);

        request.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie.cookie]);
        user.password = undefined;
        return response.send(user);
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    refresh(@Req() request: RequestWithUser) {
        const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(request.user.id);

        request.res.setHeader('Set-Cookie', accessTokenCookie);
        return request.user;
    }

    @HttpCode(200)
    @UseGuards(JwtAuthenticationGuard)
    @Post('logout')
    async logout(@Req() request: RequestWithUser) {
        await this.redisService.removeRefreshToken(request.user.id);
        request.res.setHeader('Set-Cookie', this.authService.getCookieForLogout());
    }
}
