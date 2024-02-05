import { ConflictException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dto";
import { User } from "./entities/user.entity";
import * as bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async createUser(userData: CreateUserDto): Promise<User> {
        const existingUser = await this.getUserByEmail(userData.email);

        if (existingUser) {
            throw new ConflictException(`User with ${userData.email} already exists`);
        }

        try {
            const newUser = new User();
            newUser.email = userData.email;
            newUser.name = userData.name;
            newUser.password = await this.hashPassword(userData.password);
            return this.userRepository.save(newUser);
        } catch (error) {
            throw error;
        }
    }

    async hashPassword(password: string): Promise<string> {
        try {
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(password, salt);
            return hashedPassword;
        } catch (error) {
            console.error("Hash password error: ", error);
            throw error;
        }
    }

    async getUserByEmail(email: string): Promise<User> {
        try {
            return await this.userRepository.findOne({ where: { email } });
        } catch (error) {
            console.error("Get user by email error: ", error);
            throw error;
        }
    }
}
