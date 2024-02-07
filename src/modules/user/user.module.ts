import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";
import { UserRepository } from "./repository/user.repository";
import { UserController } from "./user.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            UserRepository,
        ])
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule { }
