import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../user/user.service";
import { RegisterDto } from "./dtos/register.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly userService: UserService,
    ) { }

    public async register(registraitonData: RegisterDto): Promise<any> {
        const hashedPassword = await bcrypt.hash(registraitonData.password, 10);
        try {
            const createdUser = await this.userService.createUser({
                ...registraitonData,
                password: hashedPassword,
            });
            createdUser.password = undefined;
            return createdUser;
        } catch (error) {
            if (error?.code === 'ER_DUP_ENTRY') {
                throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getAuthenticatedUser(email: string, plainTextPassword: string) {
        try {
            const user = await this.userService.getByEmail(email);
            await this.verifyPassword(plainTextPassword, user.password);
            user.password = undefined;
            return user;
        } catch (error) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }

    private async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<void> {
        const isPasswordMatching = await bcrypt.compare(
            plainTextPassword,
            hashedPassword,
        );
        if (!isPasswordMatching) {
            throw new HttpException('Wrong credentials provided', HttpStatus.BAD_REQUEST);
        }
    }

    public getCookieWithJwtAccessToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('ACCESS_KEY'),
            expiresIn: `${this.configService.get<string>('ACCESS_EXPIRATION_TIME')}s`,
        });
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get<string>('ACCESS_EXPIRATION_TIME')}`;
    }

    public getCookieWithJwtRefreshToken(userId: number) {
        const payload: TokenPayload = { userId };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('REFRESH_KEY'),
            expiresIn: `${this.configService.get<string>('REFRESH_EXPIRATION_TIME')}s`,
        });
        const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get<string>('REFRESH_EXPIRATION_TIME')}`
        return {
            cookie,
            token
        }
    }

    public getCookieForLogout() {
        return [
            'Authentication=; HttpOnly; Path=/; Max-Age=0',
            'Refresh=; HttpOnly; Path=/; Max-Age=0'
        ];
    }
}
