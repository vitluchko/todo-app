import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-yet";
import { RedisService } from "./redis.service";

@Module({
    imports: [
        CacheModule.registerAsync({
            isGlobal: true,
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => {
                const store = await redisStore({
                    ttl: 3600 * 1000,
                    socket: {
                        host: configService.get<string>('redisHost'),
                        port: configService.get<number>('redisPort'),                        
                    },
                    username: configService.get<string>('redisUser'),
                    password: configService.get<string>('redisPassword'),
                });
                return { store };
            },
            inject: [ConfigService],
        }),
    ],
    providers: [RedisService],
    exports: [RedisService],
})
export class RedisModule { }
