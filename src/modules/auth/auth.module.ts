import { Module, forwardRef } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { RedisModule } from "../redis/redis.module";

@Module({
    imports: [
        forwardRef(() => UserModule),
        forwardRef(() => RedisModule),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }
