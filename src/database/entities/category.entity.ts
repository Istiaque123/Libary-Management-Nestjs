import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from "typeorm";
import { Book } from ".";

@Entity()
@Tree('nested-set')
export class Category{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name:string;

    @Column({
        nullable: true
    })
    description?: string;

    @TreeChildren()
    children: Category[]

    @TreeParent()
    parent: Category;

    @OneToMany(
        () => Book, book => book.category
    )
    book: Book[]

}