import { BookStateus } from "src/common/types";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from ".";

@Entity()
export class Book{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title:string;

    @Column({
        type: "text"
    })
    description:string;

    @Column()
    author: string;

    @Column({
        unique: true
    })
    serialNumber: string;

    @Column()
    editon:string;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2
    })
    price: number;

    @Column({
        type: "enum",
        enum: BookStateus,
        default: BookStateus.AVAILABLE
    })
    status: BookStateus;


    @ManyToMany( 
        ()=> User, user => user.borrowedBooks
    )
    @JoinColumn()
    borrowedBy?: User;

    @Column({
        nullable: true
    })
    borrowedAt?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}