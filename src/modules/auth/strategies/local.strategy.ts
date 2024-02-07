import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";
import { Injectable } from "@nestjs/common";
import { User } from "src/modules/user/entities/user.entity";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService,
    ) {
        super({
            usernameField: 'email',
        }); // config
    }

    async validate(email: string, password: string): Promise<User> {
        return this.authService.getAuthenticatedUser(email, password);
    }
}
