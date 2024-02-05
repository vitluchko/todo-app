import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { User } from "../user/entities/user.entity";
import { CreateUserDto } from "../user/dtos/create-user.dto";
import { UserService } from "../user/user.service";
import { RedisService } from "../redis/redis.service";

@Injectable()
export class AuthService {
    constructor (
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
    ) { }

    async registerUser(userData: CreateUserDto): Promise<User> {
        return this.userService.createUser(userData);
    }
}
