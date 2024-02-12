import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async createUser(userData: CreateUserDto): Promise<User> {
        const newUser = this.userRepository.create(userData);
        await this.userRepository.save(newUser);
        return newUser;
    }

    async getByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (user) {
            return user;
        }
        throw new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Invalid Credentials' },
            HttpStatus.NOT_FOUND,
        );
    }

    async getById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (user) {
            return user;
        }
        throw new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Invalid Credentials' },
            HttpStatus.NOT_FOUND,
        );
    }

    async getByName(name: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { name } });
        if (user) {
            user.password = undefined;
            return user;
        }
        throw new HttpException(
            { status: HttpStatus.NOT_FOUND, error: 'Invalid Credentials' },
            HttpStatus.NOT_FOUND,
        );
    }

    async markEmailAsConfirmed(email: string) {
        return this.userRepository.update({ email }, {
            isEmailConfirmed: true
        });
    }
}
