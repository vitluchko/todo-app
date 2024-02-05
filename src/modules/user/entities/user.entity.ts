import { Todo } from "src/modules/todo/entities/todo.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'user' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column()
    password: string;

    @OneToMany(() => Todo, (todo) => todo.user)
    todo: Todo[];

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}
