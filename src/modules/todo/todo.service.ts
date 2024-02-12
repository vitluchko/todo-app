import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Todo } from "./entities/todo.entity";
import { Repository } from "typeorm";

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(Todo)
        private readonly todoRepository: Repository<Todo>
    ) { }

    async getAll(userId: number) {
        try {
            const todos = await this.todoRepository.find({ where: { user_id: userId } });
            if (todos) {
                return todos;
            }
        } catch (error) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, error: error.message },
                HttpStatus.NOT_FOUND,
            );
        }
    }

    async createTodo(todo: Todo) {
        await this.todoRepository.save(todo);
    }

    async getById(id: number) {
        const todo = await this.todoRepository.findOne({ where: { id } });
        if (todo) {
            return todo;
        }
        throw new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Not found' },
            HttpStatus.NOT_FOUND,
        );
    }

    async update(id: number, todo: Todo) {
        const hasTodo = await this.getById(id);
        if (!hasTodo) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, error: 'Not found' },
                HttpStatus.NOT_FOUND,
            );
        }

        Object.assign(hasTodo, todo);

        await this.todoRepository.update(id, hasTodo);
    }

    async delete(id: number) {
        const hasTodo = await this.getById(id);
        if (!hasTodo) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, error: 'Not found' },
                HttpStatus.NOT_FOUND,
            );
        }
        await this.todoRepository.delete(id);
    }

    async deleteAll(userId: number) {
        const todos = await this.todoRepository.find({ where: { user_id: userId } });
        if (!todos) {
            throw new HttpException(
                { status: HttpStatus.NOT_FOUND, error: 'Not found' },
                HttpStatus.NOT_FOUND,
            );
        }
        await this.todoRepository.remove(todos);
    }
}
