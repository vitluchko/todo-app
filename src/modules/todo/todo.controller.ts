import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { TodoService } from "./todo.service";
import { CreateTodoDto } from "./dtos/create-todo.dto";
import { Todo } from "./entities/todo.entity";
import RequestWithUser from "../auth/interfaces/user-request.interface";
import JwtAuthenticationGuard from "../auth/guards/jwt-auth.guard";
import { UpdateTodoDto } from "./dtos/update-todo.dto";
import { FindOneParams } from "./utils/find-one.params";
import { ApiBody, ApiParam, ApiTags } from "@nestjs/swagger";

@UseGuards(JwtAuthenticationGuard)
@Controller('todo')
@ApiTags('todo')
@UseInterceptors(ClassSerializerInterceptor)
export default class TodoController {
    constructor (
        private readonly todoService: TodoService,
    ) { }

    @Post()
    @ApiBody({ type: CreateTodoDto })
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
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Should be an id of a todo that exists in the database',
        type: Number,
    })
    async getOne(@Param() { id }: FindOneParams) {
        return await this.todoService.getById(Number(id));
    }

    @Put(':id')
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Should be an id of a todo that exists in the database',
        type: Number,
    })
    @ApiBody({ type: UpdateTodoDto })
    async update(
        @Param() { id }: FindOneParams,
        @Body() data: UpdateTodoDto
    ) {
        const updatedTodo = new Todo();
        Object.assign(updatedTodo, data)
        return await this.todoService.update(Number(id), updatedTodo);
    }

    @Delete(':id')
    @ApiParam({
        name: 'id',
        required: true,
        description: 'Should be an id of a todo that exists in the database',
        type: Number,
    })
    async remove(@Param() { id }: FindOneParams) {
        return await this.todoService.delete(Number(id));
    }

    @Delete()
    async removeAll(@Req() request: RequestWithUser) {
        await this.todoService.deleteAll(request.user.id);
        return { message: 'success' };
    }
}
