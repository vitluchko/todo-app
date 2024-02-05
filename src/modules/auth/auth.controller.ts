import { Body, Controller, HttpException, HttpStatus, Post, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "../user/entities/user.entity";
import { CreateUserDto } from "../user/dtos/create-user.dto";
import { CacheInterceptor, CacheTTL } from "@nestjs/cache-manager";
import { RedisService } from "../redis/redis.service";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly service: AuthService,
        private readonly redisService: RedisService,
    ) { }

    @UseInterceptors(CacheInterceptor)
    @CacheTTL(60 * 1000)
    @Post('register')
    async register(
        @Body() userDto: CreateUserDto,
    ): Promise<User> {
        try {
            await this.redisService.insertUser(userDto.email, userDto.name);
            return await this.service.registerUser(userDto);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
