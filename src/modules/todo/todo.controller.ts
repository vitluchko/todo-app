import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import { TodoService } from "./todo.service";
import { CreateTodoDto } from "./dtos/create-todo.dto";
import { Todo } from "./entities/todo.entity";
import RequestWithUser from "../auth/interfaces/user-request.interface";
import JwtAuthenticationGuard from "../auth/guards/jwt-auth.guard";
import { UpdateTodoDto } from "./dtos/update-todo.dto";

@UseGuards(JwtAuthenticationGuard)
@Controller('todo')
export default class TodoController {
    constructor (
        private readonly todoService: TodoService,
    ) { }

    @Post()
    async createTodo(
        @Req() request: RequestWithUser,
        @Body() data: CreateTodoDto
    ) {
        const newTodo = new Todo();
        newTodo.user_id = request.user.id;
        Object.assign(newTodo, data);
        await this.todoService.createTodo(newTodo);
        return { message: 'success' };
    }

    @Get()
    async getAll(@Req() request: RequestWithUser) {
        return await this.todoService.getAll(request.user.id);
    }

    @Get(':id')
    async getOne(@Param('id') id: string) {
        return await this.todoService.getById(+id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() data: UpdateTodoDto
    ) {
        const updatedTodo = new Todo();
        Object.assign(updatedTodo, data)
        return await this.todoService.update(+id, updatedTodo);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.todoService.delete(+id);
    }

    @Delete()
    async removeAll(@Req() request: RequestWithUser) {
        await this.todoService.deleteAll(request.user.id);
        return { message: 'success' };
    }
}
