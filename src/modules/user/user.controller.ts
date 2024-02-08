import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import JwtAuthenticationGuard from "../auth/guards/jwt-auth.guard";

@Controller('user')
export class UserController {
    constructor (
        private readonly userService: UserService,
    ) { }

    @Get(':email')
    @UseGuards(JwtAuthenticationGuard)
    async getUser(@Param('email') email: string) {
        const user = await this.userService.getByEmail(email);
        user.password = undefined;
        return user;
    }
}
