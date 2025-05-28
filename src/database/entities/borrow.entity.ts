import { Column, CreateDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Book } from "./book.entity";
import { User } from "./user.entity";

@Entity()
export class BorrowRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Book, (book) => book.borrowRecords)
    book: Book;


    @ManyToOne(() => User,
        (user) => user.borrowRecords)
    user: User;

    @Column()
    borrowedAt: Date;

    @Column()
    dueDate: Date;

    @Column({ nullable: true })
    returnedAt?: Date ;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    fine: number;

    @CreateDateColumn()
    createdAt: Date;

}