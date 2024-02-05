import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class RedisService {
    constructor (
        @Inject('CACHE_MANAGER')
        private readonly cacheManager: Cache,
    ) { }

    async insertUser(key: string, value: string): Promise<void> {
        await this.cacheManager.set(key, value);
    }
}
