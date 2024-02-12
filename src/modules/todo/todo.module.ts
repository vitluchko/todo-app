import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Todo } from "./entities/todo.entity";
import { TodoService } from "./todo.service";
import TodoController from "./todo.controller";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
    imports: [
        CacheModule.register({
            ttl: 5,
            max: 100,
        }),
        TypeOrmModule.forFeature([
            Todo,
        ])
    ],
    controllers: [TodoController],
    providers: [TodoService],
})
export class TodoModule { }
