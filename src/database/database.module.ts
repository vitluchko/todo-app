import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get<string>('dbHost'),
                port: configService.get<number>('dbPort'),
                username: configService.get<string>('dbUsername'),
                password: configService.get<string>('dbPassword'),
                database: configService.get<string>('dbName'),
                entities: [
                    __dirname + '/../**/*.entity{.ts,.js}',
                ],
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
    ]
})
export class DatabaseModule { }
