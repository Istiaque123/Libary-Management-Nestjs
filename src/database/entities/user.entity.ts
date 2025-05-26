import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./book.entity";
import { UserRole } from "src/common/types";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({
        unique: true
    })
    email:string;

    @Column()
    password:string;

    @Column()
    username: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;
    

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(
        () => Book, book => book.borrowedBy
    )
    borrowedBooks: Book[]
}