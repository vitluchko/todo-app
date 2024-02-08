import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import databaseConfig from './config/db.config';
import appConfig from './config/app.config';
import * as Joi from 'joi';
import { UserModule } from './modules/user/user.module';
import { TodoModule } from './modules/todo/todo.module';
import { AuthModule } from './modules/auth/auth.module';
import redisConfig from './config/redis.config';
import { RedisModule } from './modules/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        redisConfig,
      ],
      validationSchema: Joi.object({
        DB_USER_PASSWORD: Joi.string().required(),
        DB_USER_NAME: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_PORT: Joi.number(),
        PORT: Joi.number(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number(),
        REDIS_USER: Joi.string().required(),
        REDIS_PASSWORD: Joi.string().required(),
        ACCESS_KEY: Joi.string().required(),
        ACCESS_EXPIRATION_TIME: Joi.string().required(),
        REFRESH_KEY: Joi.string().required(),
        REFRESH_EXPIRATION_TIME: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    RedisModule,
    UserModule,
    TodoModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
