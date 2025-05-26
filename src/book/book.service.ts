
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BookStateus } from 'src/common/types';
import { CreateBookDto, UpdateBookDto, type BorrowBookDto, type SearchBookDto } from 'src/database/dto';

import { Book, Category, User } from 'src/database/entities';
import { Like, type Repository } from 'typeorm';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Category) private readonly cetegoryRepository: Repository<Category>,
    ){}

    async createBook(createBookDto: CreateBookDto): Promise<Book>{
        const category = await this.cetegoryRepository.findOne({
            where : {
                id: createBookDto.categoryId
            }
        });

        if(!category){
            throw new NotFoundException("Category not found");
        }

        const book = this.bookRepository.create({
            ...createBookDto,
            category
        });

        return this.bookRepository.save(book);
    }

    async updateBook(id:number, updateBookDto: UpdateBookDto): Promise<Book>{
        const book = await this.bookRepository.findOne({
            where: {
                id
            },
             relations: ['category']
        });

        if(!book){
            throw new NotFoundException("Book not found");
        }

        if (updateBookDto.categoryId) {
            const category = await this.cetegoryRepository.findOne({
                where: {
                    id: updateBookDto.categoryId
                }
            })

            if (!category) {
                throw new NotFoundException("Category not found");
            }

            book.category = category;
        }

        Object.assign(book, updateBookDto);
        return this.bookRepository.save(book, );


    }

    async borrowBook(id: number, borrowBookDto:BorrowBookDto): Promise<Book>{
        const book = await this.bookRepository.findOne({
            where:{
                id
            },
            relations: ['borrowedBy']
        });

        if (!book) {
            throw new NotFoundException("Book not found");
        }
        if (book.status !== BookStateus.AVAILABLE) {
            throw new NotFoundException("Currently book is not available");
        }

        const user = await this.userRepository.findOne({
            where: {
                id: borrowBookDto.userId,
            }
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        book.status = BookStateus.BORROWED;
        book.borrowedBy = user;
        book.borrowedAt =  new Date();
        book.returnDate = borrowBookDto.returnDate;

        return this.bookRepository.save(book,);
    }

    async returnBook(id: number) : Promise<Book>{
         const book = await this.bookRepository.findOne({
            where:{
                id
            },
            relations: ['borrowedBy']
        });

        if (!book) {
            throw new NotFoundException("Book not found");
        }

        if (book.status !== BookStateus.BORROWED ) {
            throw new NotFoundException("Book is not currently borrowed");
        }

        book.status = BookStateus.AVAILABLE;
        book.borrowedAt = undefined;
        book.borrowedBy = undefined;
        book.returnDate = undefined;
        return this.bookRepository.save(book);
    }

    async searchBooks(searchBooksDto: SearchBookDto){
         const { title, author, categoryId, status, includeSimilar } = searchBooksDto;
         const where: any = {};
         if(title){
            where.title = includeSimilar ? Like(`%${title}%`) : title;
         }

         if (author) {
            where.author = includeSimilar ? Like(`%${author}%`) : author;
        }

        if (categoryId) {
            where.category = { id: categoryId };
        }

        if (status) {
            where.status = status;
        }

        return this.bookRepository.find({
            where,
            relations: ['category', 'borrowedBy']
        });
    }

    async getBookById(id:number): Promise<Book>{
        const book = await this.bookRepository.findOne({
            where : {
                id
            },
            relations: ['category', 'borrowedBy']
        });

          if (!book) {
            throw new NotFoundException('Book not found');
        }

        return book;
    }

    async getAllBooks():Promise<Book[] >{
        return this.bookRepository.find({
            relations: ['category', 'borrowedBy']
        });
    }

    async deleteBook(id: number): Promise<void>{

        const result = await this.bookRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException("Book not found");
        }
    }
}
