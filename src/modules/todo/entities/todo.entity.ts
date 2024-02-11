import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'todo' })
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ default: false })
    isConfirmed: boolean;

    @Column({ name: 'user_id' })
    user_id: number;

    @ManyToOne(() => User, (user) => user.todo)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
