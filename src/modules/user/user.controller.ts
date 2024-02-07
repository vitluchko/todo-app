import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import JwtAuthenticationGuard from "../auth/guards/jwt-auth.guard";

@Controller('user')
export class UserController {
    constructor (
        private readonly userService: UserService,
    ) { }

    @Get(':username')
    @UseGuards(JwtAuthenticationGuard)
    async getUser(@Param('username') username: string) {
        return await this.userService.getByName(username);
    }
}
