import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";
import * as bcrypt from "bcrypt";
import { User } from "../user/entities/user.entity";

@Injectable()
export class RedisService {
    constructor(
        @Inject('CACHE_MANAGER')
        private readonly cacheManager: Cache,
    ) { }

    async insertToken(userId: number, refreshToken: string): Promise<void> {
        const token = await this.cacheManager.get(userId.toString());
        if (token) {
            await this.removeRefreshToken(userId);
        }

        const currenHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.cacheManager.set(userId.toString(), currenHashedRefreshToken);
    }

    async getIfRefreshTokenMatches(user: User, refreshToken: string) {
        const token = await this.cacheManager.get(user.id.toString());
        if (token) {
            const isRefreshTokenMatching = bcrypt.compare(
                refreshToken,
                token.toString(),
            );

            if (isRefreshTokenMatching) {
                return user;
            }
        }
    }

    async removeRefreshToken(userId: number) {
        await this.cacheManager.del(userId.toString());
    }
}
