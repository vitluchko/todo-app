import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class RedisService {
    constructor (
        @Inject('CACHE_MANAGER')
        private readonly cacheManager: Cache,
    ) { }

    async insertTokens(key: string, aceess_token: string, refresh_token: string): Promise<void> {
        await this.cacheManager.set(key, { aceess_token, refresh_token });
    }
}
