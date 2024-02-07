import { Body, Controller, HttpCode, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { RegisterDto } from "./dtos/register.dto";
import RequestWithUser from "./interfaces/user-request.interface";
import { Response } from "express";
import JwtAuthenticationGuard from "./guards/jwt-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('register')
    async register(@Body() registrationData: RegisterDto) {
        return this.authService.register(registrationData);
    }

    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(
        @Req() request: RequestWithUser,
        @Res() response: Response,
    ) {
        const { user } = request;
        const cookie = this.authService.getCookieWithJwtToken(user.id);
        response.setHeader('Set-Cookie', cookie);
        user.password = undefined;
        return response.send(user);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Post('logout')
    async logout(
        @Req() request: RequestWithUser, 
        @Res() response: Response,
    ) {
        response.setHeader('Set-Cookie', this.authService.getCookieForLogout());
        return response.sendStatus(200);
    }
}
