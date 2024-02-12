import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import JwtAuthenticationGuard from "../auth/guards/jwt-auth.guard";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { FindOneParams } from "./utils/find-one.params";

@Controller('user')
@ApiTags('user')
export class UserController {
    constructor (
        private readonly userService: UserService,
    ) { }

    @UseGuards(JwtAuthenticationGuard)
    @Get(':email')
    @ApiParam({
        name: 'email',
        required: true,
        description: 'Should be an email of a user that exists in the database',
        type: String,
    })
    async getUser(@Param() { email }: FindOneParams) {
        const user = await this.userService.getByEmail(email);
        user.password = undefined;
        return user;
    }
}
