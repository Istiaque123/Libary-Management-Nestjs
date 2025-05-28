import { BookStateus } from "src/common/types";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category, User } from ".";

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
        unique: true,

    })
    serialNumber: string;

    @Column({
        default: "1st"
    })
    editon:string;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2
    })
    price: number;

    @ManyToOne(
        () => Category, category => category.book
    )
    // @JoinColumn()
    category: Category;

    @Column({
        type: "enum",
        enum: BookStateus,
        default: BookStateus.AVAILABLE
    })
    status: BookStateus;


    @ManyToOne( 
        ()=> User, user => user.borrowedBooks,
        { nullable: true }
    )
    // @JoinColumn()
    borrowedBy?: User;

    @Column({
        nullable: true
    })
    borrowedAt?: Date;

    @Column({
        nullable: true
    })
    returnDate?: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}