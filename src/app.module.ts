import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import databaseConfig from './config/db.config';
import appConfig from './config/app.config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
      ],
      validationSchema: Joi.object({
        DB_USER_PASSWORD: Joi.string().required(),
        DB_USER_NAME: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_PORT: Joi.number(),
        PORT: Joi.number(),
      }),
    }),
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
