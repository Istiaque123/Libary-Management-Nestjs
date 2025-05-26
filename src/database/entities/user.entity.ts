import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "../dto";

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
}