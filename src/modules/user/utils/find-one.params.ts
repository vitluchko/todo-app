import { IsEmail } from "class-validator";

export class FindOneParams {
    @IsEmail()
    email: string;
}
