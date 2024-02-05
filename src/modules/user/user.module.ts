import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserService } from "./user.service";
import { UserRepository } from "./repository/user.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            UserRepository,
        ])
    ],
    controllers: [],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule { }
