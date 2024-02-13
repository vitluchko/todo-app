import { Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { EmailConfirmationService } from "./services/email-confirm.service";
import JwtAuthenticationGuard from "../auth/guards/jwt-auth.guard";
import RequestWithUser from "../auth/interfaces/user-request.interface";
import { ApiParam, ApiTags } from "@nestjs/swagger";
import { FindOneParams } from "./utils/find-one.params";

@Controller('email-confirmation')
@ApiTags('email-confirmation')
export class EmailConfirmationController {
    constructor (
        private readonly emailConfirmationService: EmailConfirmationService,
    ) { }

    @Get(':token')
    @ApiParam({
        name: 'token',
        required: true,
        description: 'Should be a valid token',
        type: String,
    })
    async confirm(@Param() { token }: FindOneParams) {
        const email = await this.emailConfirmationService.decodeConfirmationToken(token);
        await this.emailConfirmationService.confirmEmail(email);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Post('resend-confirmation-link')
    async resendConfirmationLink(@Req() request: RequestWithUser) {
        await this.emailConfirmationService.resendConfirmationLink(request.user.id);
    }
}
